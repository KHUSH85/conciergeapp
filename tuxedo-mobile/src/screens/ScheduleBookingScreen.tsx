import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { MotiView } from 'moti';
import { ArrowLeft, Calendar, Clock, Car, User, Phone, Mail, ChevronRight, ChevronLeft } from 'lucide-react-native';
import { GlassCard, GoldButton } from '../components/GlassCard';
import { ScreenShell } from '../components/ScreenShell';
import { useApp } from '../context/AppContext';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isBefore, startOfDay } from 'date-fns';

const GOLD = '#D4AF37';
type Step = 'guest' | 'schedule' | 'chauffeur' | 'confirm';
const STEPS: Step[] = ['guest', 'schedule', 'chauffeur', 'confirm'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarPicker = ({ visible, onClose, onSelect, selected }: {
  visible: boolean; onClose: () => void; onSelect: (date: Date) => void; selected: Date | null;
}) => {
  const [viewMonth, setViewMonth] = useState(selected || new Date());
  const today = startOfDay(new Date());
  const monthStart = startOfMonth(viewMonth);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(endOfMonth(viewMonth));
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={cal.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={cal.container}>
          {/* Header */}
          <View style={cal.header}>
            <TouchableOpacity onPress={() => setViewMonth(subMonths(viewMonth, 1))} style={cal.navBtn}>
              <ChevronLeft color={GOLD} size={20} />
            </TouchableOpacity>
            <Text style={cal.monthLabel}>{format(viewMonth, 'MMMM yyyy')}</Text>
            <TouchableOpacity onPress={() => setViewMonth(addMonths(viewMonth, 1))} style={cal.navBtn}>
              <ChevronRight color={GOLD} size={20} />
            </TouchableOpacity>
          </View>
          {/* Day names */}
          <View style={cal.daysRow}>
            {DAYS.map(d => <Text key={d} style={cal.dayName}>{d}</Text>)}
          </View>
          {/* Grid */}
          <View style={cal.grid}>
            {days.map((day, i) => {
              const isCurrentMonth = isSameMonth(day, viewMonth);
              const isPast = isBefore(day, today);
              const isSelected = selected ? isSameDay(day, selected) : false;
              const isToday = isSameDay(day, today);
              return (
                <TouchableOpacity
                  key={i}
                  disabled={isPast || !isCurrentMonth}
                  onPress={() => { onSelect(day); onClose(); }}
                  style={[cal.dayCell, isSelected && cal.dayCellSelected, isToday && !isSelected && cal.dayCellToday]}
                >
                  <Text style={[cal.dayText, !isCurrentMonth && cal.dayTextOther, isPast && cal.dayTextPast, isSelected && cal.dayTextSelected]}>
                    {format(day, 'd')}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export const ScheduleBookingScreen = ({ navigation }: any) => {
  const { user } = useApp();
  const [step, setStep] = useState<Step>('guest');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDateObj, setSelectedDateObj] = useState<Date | null>(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [chooseChauffeur, setChooseChauffeur] = useState<boolean | null>(null);
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [contactMethod, setContactMethod] = useState<'phone' | 'email'>('phone');

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const handleEmailChange = (val: string) => {
    setGuestEmail(val);
    setEmailError(val && !validateEmail(val) ? 'Please enter a valid email address' : '');
  };

  const canProceedSchedule = selectedDate.length > 0 && selectedTime.length > 0;
  const canProceedChauffeur = chooseChauffeur !== null;
  const canSubmit = contactMethod === 'phone' ? guestPhone.length > 5 : (guestEmail && validateEmail(guestEmail) && !emailError);

  const goNext = () => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  };
  const goBack = () => {
    const idx = STEPS.indexOf(step);
    if (idx === 0) navigation.goBack();
    else setStep(STEPS[idx - 1]);
  };

  const handleRequest = () => {
    navigation.navigate('WaitingForPayment', {
      bookingMode: 'scheduled',
      scheduledDate: selectedDate,
      scheduledTime: selectedTime,
      chooseChauffeur,
      guestPhone: contactMethod === 'phone' ? guestPhone : '',
      guestEmail: contactMethod === 'email' ? guestEmail : '',
      pickupLocation: user?.hotelName || 'The Grand Majestic Hotel',
    });
  };

  return (
    <ScreenShell keyboardAvoiding>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <ArrowLeft color={GOLD} size={18} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        {/* Step dots */}
        <View style={styles.stepsRow}>
          {STEPS.map((s, i) => (
            <View key={s} style={styles.stepItem}>
              <View style={[styles.stepDot, STEPS.indexOf(step) >= i && styles.stepDotActive]} />
              {i < STEPS.length - 1 && <View style={styles.stepLine} />}
            </View>
          ))}
        </View>

        {/* Step 1: Guest Info */}
        {step === 'guest' && (
          <GlassCard style={styles.card}>
            <Text style={styles.title}>Schedule a Ride</Text>
            <Text style={styles.subtitle}>* Tracking link will be sent automatically to the guest.</Text>

            <MotiView key={contactMethod} from={{ opacity: 0, translateX: contactMethod === 'phone' ? -20 : 20 }} animate={{ opacity: 1, translateX: 0 }} transition={{ type: 'timing', duration: 300 }}>
              <View style={styles.inputWrap}>
                {contactMethod === 'phone' ? <Phone color={GOLD} size={20} style={styles.inputIcon} /> : <Mail color={GOLD} size={20} style={styles.inputIcon} />}
                <TextInput
                  style={styles.input}
                  placeholder={contactMethod === 'phone' ? 'Guest Phone Number' : 'Guest Email Address'}
                  placeholderTextColor="#6b7280"
                  value={contactMethod === 'phone' ? guestPhone : guestEmail}
                  onChangeText={contactMethod === 'phone' ? setGuestPhone : handleEmailChange}
                  keyboardType={contactMethod === 'phone' ? 'phone-pad' : 'email-address'}
                  autoCapitalize="none"
                />
              </View>
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </MotiView>

            <TouchableOpacity onPress={() => setContactMethod(contactMethod === 'phone' ? 'email' : 'phone')} style={styles.switchBtn}>
              <Text style={styles.switchText}>
                {contactMethod === 'phone' ? "Don't have a phone? Use Email instead" : 'Use Phone Number instead'}
              </Text>
            </TouchableOpacity>

            <GoldButton onPress={goNext} disabled={!canSubmit} style={styles.btn}>
              <View style={styles.btnInner}>
                <Text style={styles.btnText}>Send Ride Request</Text>
                <ChevronRight color="#000" size={18} />
              </View>
            </GoldButton>
          </GlassCard>
        )}

        {/* Step 2: Date & Time */}
        {step === 'schedule' && (
          <GlassCard style={styles.card}>
            <Text style={styles.title}>Reserve a Ride</Text>
            <Text style={styles.subtitle}>Choose the date and time for the guest's ride.</Text>

            <CalendarPicker
              visible={calendarVisible}
              onClose={() => setCalendarVisible(false)}
              selected={selectedDateObj}
              onSelect={(date) => {
                setSelectedDateObj(date);
                setSelectedDate(format(date, 'yyyy-MM-dd'));
              }}
            />

            <TouchableOpacity style={styles.inputWrap} onPress={() => setCalendarVisible(true)}>
              <Calendar color={GOLD} size={20} style={styles.inputIcon} />
              <Text style={[styles.input, !selectedDate && { color: '#6b7280' }]}>
                {selectedDate || 'Select Date'}
              </Text>
            </TouchableOpacity>
            <View style={styles.inputWrap}>
              <Clock color={GOLD} size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Time (HH:MM)"
                placeholderTextColor="#6b7280"
                value={selectedTime}
                onChangeText={setSelectedTime}
              />
            </View>

            {canProceedSchedule && (
              <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={styles.summaryBox}>
                <Text style={styles.summaryLabel}>Scheduled For</Text>
                <Text style={styles.summaryValue}>{selectedDate} at {selectedTime}</Text>
              </MotiView>
            )}

            <GoldButton onPress={goNext} disabled={!canProceedSchedule} style={styles.btn}>
              <View style={styles.btnInner}>
                <Text style={styles.btnText}>Continue</Text>
                <ChevronRight color="#000" size={18} />
              </View>
            </GoldButton>
          </GlassCard>
        )}

        {/* Step 3: Chauffeur */}
        {step === 'chauffeur' && (
          <GlassCard style={styles.card}>
            <Text style={styles.title}>Choose Chauffeur</Text>
            <Text style={styles.subtitle}>Would you like to pre-select a chauffeur?</Text>

            {[
              { id: true, title: 'Yes, Choose a Chauffeur', desc: 'Browse and select a preferred driver', icon: User },
              { id: false, title: 'Auto-Assign', desc: 'Best available chauffeur will be assigned', icon: Car },
            ].map(({ id, title, desc, icon: Icon }) => (
              <TouchableOpacity
                key={String(id)}
                onPress={() => setChooseChauffeur(id)}
                style={[styles.optionBtn, chooseChauffeur === id && styles.optionBtnActive]}
              >
                <View style={styles.optionIcon}><Icon color={GOLD} size={22} /></View>
                <View style={styles.optionInfo}>
                  <Text style={styles.optionTitle}>{title}</Text>
                  <Text style={styles.optionDesc}>{desc}</Text>
                </View>
              </TouchableOpacity>
            ))}

            <GoldButton
              onPress={() => chooseChauffeur === true ? navigation.navigate('DriverList') : goNext()}
              disabled={!canProceedChauffeur}
              style={styles.btn}
            >
              <View style={styles.btnInner}>
                <Text style={styles.btnText}>Continue</Text>
                <ChevronRight color="#000" size={18} />
              </View>
            </GoldButton>
          </GlassCard>
        )}

        {/* Step 4: Confirm */}
        {step === 'confirm' && (
          <GlassCard style={styles.card}>
            <Text style={styles.title}>Confirm Booking</Text>
            <Text style={styles.subtitle}>Review and confirm the scheduled ride.</Text>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Scheduled Ride</Text>
              <Text style={styles.summaryValue}>{selectedDate} at {selectedTime}</Text>
            </View>

            <GoldButton onPress={handleRequest} style={styles.btn}>
              <Text style={styles.btnText}>Confirm Booking</Text>
            </GoldButton>
          </GlassCard>
        )}
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  backText: { color: GOLD, fontWeight: '700', fontSize: 14 },
  stepsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  stepItem: { flexDirection: 'row', alignItems: 'center' },
  stepDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#374151' },
  stepDotActive: { backgroundColor: GOLD },
  stepLine: { width: 24, height: 1, backgroundColor: '#374151', marginHorizontal: 4 },
  card: { padding: 24 },
  title: { fontSize: 22, color: '#fff', fontWeight: '900', marginBottom: 6 },
  subtitle: { fontSize: 13, color: '#9ca3af', fontStyle: 'italic', fontWeight: '500', marginBottom: 20 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', borderWidth: 2, borderColor: 'rgba(212,175,55,0.3)', borderRadius: 12, paddingHorizontal: 14, marginBottom: 14 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#fff', fontSize: 15, paddingVertical: 14, fontWeight: '500' },
  summaryBox: { backgroundColor: 'rgba(212,175,55,0.1)', borderWidth: 2, borderColor: 'rgba(212,175,55,0.4)', borderRadius: 12, padding: 14, marginBottom: 20 },
  summaryLabel: { color: GOLD, fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  summaryValue: { color: '#fff', fontWeight: '700', fontSize: 15 },
  btn: { width: '100%', paddingVertical: 18, marginTop: 4 },
  btnInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnText: { color: '#000', fontWeight: '900', fontSize: 15, textAlign: 'center', textTransform: 'uppercase' },
  optionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)', borderWidth: 2, borderColor: 'rgba(212,175,55,0.2)', borderRadius: 14, padding: 16, marginBottom: 12 },
  optionBtnActive: { borderColor: GOLD, backgroundColor: 'rgba(212,175,55,0.1)' },
  optionIcon: { padding: 10, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.4)', borderWidth: 1, borderColor: 'rgba(212,175,55,0.2)', marginRight: 14 },
  optionInfo: { flex: 1 },
  optionTitle: { color: '#fff', fontWeight: '700', fontSize: 15, marginBottom: 2 },
  optionDesc: { color: '#9ca3af', fontSize: 13, fontWeight: '500' },
  errorText: { color: '#f87171', fontSize: 12, marginBottom: 8, marginLeft: 4 },
  switchBtn: { marginBottom: 20 },
  switchText: { color: GOLD, fontWeight: '700', fontSize: 13 },
});

const cal = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  container: { backgroundColor: '#1a1a2e', borderWidth: 2, borderColor: 'rgba(212,175,55,0.4)', borderRadius: 16, padding: 16, width: '100%', maxWidth: 340 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  navBtn: { padding: 8 },
  monthLabel: { color: '#fff', fontWeight: '900', fontSize: 16 },
  daysRow: { flexDirection: 'row', marginBottom: 8 },
  dayName: { flex: 1, textAlign: 'center', color: GOLD, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.28%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  dayCellSelected: { backgroundColor: GOLD },
  dayCellToday: { borderWidth: 1, borderColor: GOLD },
  dayText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  dayTextOther: { color: '#374151' },
  dayTextPast: { color: '#374151' },
  dayTextSelected: { color: '#000', fontWeight: '900' },
});
