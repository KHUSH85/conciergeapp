import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { MotiView } from 'moti';
import { Calendar, Clock, Phone, Mail, ChevronRight, ChevronLeft, ArrowRightLeft } from 'lucide-react-native';
import { GlassCard } from '../components/GlassCard';
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';
import { AppScreen } from '../components/AppScreen';
import { useHaptics } from '../hooks/useHaptics';
import { useStaggerAnimation } from '../hooks/useStaggerAnimation';
import { useApp } from '../context/AppContext';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isBefore, startOfDay } from 'date-fns';

const GOLD = '#D4AF37';
type Step = 'guest' | 'schedule' | 'serviceType' | 'confirm';
const STEPS: Step[] = ['guest', 'schedule', 'serviceType', 'confirm'];
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
          <View style={cal.header}>
            <TouchableOpacity onPress={() => setViewMonth(subMonths(viewMonth, 1))} style={cal.navBtn}>
              <ChevronLeft color={GOLD} size={20} />
            </TouchableOpacity>
            <Text style={cal.monthLabel}>{format(viewMonth, 'MMMM yyyy')}</Text>
            <TouchableOpacity onPress={() => setViewMonth(addMonths(viewMonth, 1))} style={cal.navBtn}>
              <ChevronRight color={GOLD} size={20} />
            </TouchableOpacity>
          </View>
          <View style={cal.daysRow}>
            {DAYS.map(d => <Text key={d} style={cal.dayName}>{d}</Text>)}
          </View>
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
                  accessibilityRole="button"
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
  const { user, addOpenRideRequest } = useApp();
  const { light } = useHaptics();
  const delays = useStaggerAnimation();
  const [step, setStep] = useState<Step>('guest');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDateObj, setSelectedDateObj] = useState<Date | null>(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [serviceType, setServiceType] = useState<'transfer' | 'hourly'>('transfer');
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
    const pickup = user?.hotelName || 'The Grand Majestic Hotel';
    const guestLabel = contactMethod === 'phone' ? guestPhone : guestEmail;
    const scheduledFor = `${selectedDate} · ${selectedTime}`;
    addOpenRideRequest({
      guestLabel,
      pickup,
      serviceType,
      status: 'awaiting_guest',
      scheduledFor,
    });
    navigation.navigate('WaitingForPayment', {
      bookingMode: 'scheduled',
      scheduledDate: selectedDate,
      scheduledTime: selectedTime,
      guestPhone: contactMethod === 'phone' ? guestPhone : '',
      guestEmail: contactMethod === 'email' ? guestEmail : '',
      pickupLocation: pickup,
      serviceType,
    });
  };

  return (
    <AppScreen keyboardAvoiding noTopPad>
      {/* ── Step indicator ── */}
      <MotiView
        from={{ opacity: 0, translateY: -8 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 220, delay: delays.header }}
      >
        <View style={styles.stepsRow}>
          {STEPS.map((s, i) => (
            <View key={s} style={styles.stepItem}>
              <View style={[styles.stepDot, STEPS.indexOf(step) >= i && styles.stepDotActive]} />
              {i < STEPS.length - 1 && <View style={styles.stepLine} />}
            </View>
          ))}
        </View>
      </MotiView>

      <MotiView
        key={step}
        from={{ opacity: 0, translateY: 16 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 260, delay: delays.content }}
      >
        {step === 'guest' && (
          <GlassCard style={styles.card}>
            <Text style={styles.title}>Schedule a Ride</Text>
            <Text style={styles.subtitle}>Tracking link will be sent automatically to the guest.</Text>

            <MotiView
              key={contactMethod}
              from={{ opacity: 0, translateX: contactMethod === 'phone' ? -20 : 20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: 'timing', duration: 240 }}
            >
              <AppInput
                leftSlot={
                  <View style={styles.inputIcon}>
                    {contactMethod === 'phone' ? <Phone color={GOLD} size={20} /> : <Mail color={GOLD} size={20} />}
                  </View>
                }
                placeholder={contactMethod === 'phone' ? 'Guest Phone Number' : 'Guest Email Address'}
                value={contactMethod === 'phone' ? guestPhone : guestEmail}
                onChangeText={contactMethod === 'phone' ? setGuestPhone : handleEmailChange}
                keyboardType={contactMethod === 'phone' ? 'phone-pad' : 'email-address'}
                autoCapitalize="none"
                containerStyle={styles.inputContainer}
              />
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </MotiView>

            <TouchableOpacity
              onPress={async () => { await light(); setContactMethod(contactMethod === 'phone' ? 'email' : 'phone'); }}
              style={styles.switchBtn}
            >
              <Text style={styles.switchText}>
                {contactMethod === 'phone' ? "No phone? Use Email instead" : 'Use Phone Number instead'}
              </Text>
            </TouchableOpacity>

            <AppButton
              label="Send Ride Request"
              onPress={goNext}
              disabled={!canSubmit}
              haptic="medium"
              style={styles.ctaBtn}
            />
          </GlassCard>
        )}

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

            <TouchableOpacity style={styles.datePickerBtn} onPress={() => setCalendarVisible(true)}>
              <Calendar color={GOLD} size={20} style={styles.inputIconInline} />
              <Text style={[styles.datePickerText, !selectedDate && { color: '#6b7280' }]}>
                {selectedDate || 'Select Date'}
              </Text>
            </TouchableOpacity>

            <AppInput
              leftSlot={<View style={styles.inputIcon}><Clock color={GOLD} size={20} /></View>}
              placeholder="Time (HH:MM)"
              value={selectedTime}
              onChangeText={setSelectedTime}
              containerStyle={styles.inputContainer}
            />

            {canProceedSchedule && (
              <MotiView
                from={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={styles.summaryBox}
              >
                <Text style={styles.summaryLabel}>Scheduled For</Text>
                <Text style={styles.summaryValue}>{selectedDate} at {selectedTime}</Text>
              </MotiView>
            )}

            <AppButton
              label="Continue"
              onPress={goNext}
              disabled={!canProceedSchedule}
              haptic="medium"
              style={styles.ctaBtn}
            />
          </GlassCard>
        )}

        {step === 'serviceType' && (
          <GlassCard style={styles.card}>
            <Text style={styles.title}>Transfer or hourly</Text>
            <Text style={styles.subtitle}>Concierge rides use auto-assign. Manual chauffeur pick is for members in the passenger app only.</Text>

            <TouchableOpacity
              onPress={async () => {
                await light();
                setServiceType('transfer');
              }}
              style={[styles.optionBtn, serviceType === 'transfer' && styles.optionBtnActive]}
              accessibilityRole="radio"
              accessibilityState={{ selected: serviceType === 'transfer' }}
            >
              <View style={styles.optionIcon}>
                <ArrowRightLeft color={GOLD} size={22} />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Transfer</Text>
                <Text style={styles.optionDesc}>Point A → point B when the guest adds a drop-off.</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                await light();
                setServiceType('hourly');
              }}
              style={[styles.optionBtn, serviceType === 'hourly' && styles.optionBtnActive]}
              accessibilityRole="radio"
              accessibilityState={{ selected: serviceType === 'hourly' }}
            >
              <View style={styles.optionIcon}>
                <Clock color={GOLD} size={22} />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Hourly</Text>
                <Text style={styles.optionDesc}>Timed service from pickup; mileage rules apply in pricing later.</Text>
              </View>
            </TouchableOpacity>

            <AppButton label="Continue" onPress={goNext} haptic="medium" style={styles.ctaBtn} />
          </GlassCard>
        )}

        {step === 'confirm' && (
          <GlassCard style={styles.card}>
            <Text style={styles.title}>Confirm Booking</Text>
            <Text style={styles.subtitle}>Review and confirm the scheduled ride.</Text>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Service</Text>
              <Text style={styles.summaryValue}>{serviceType === 'transfer' ? 'Transfer (A → B)' : 'Hourly'}</Text>
            </View>

            <View style={[styles.summaryBox, { marginTop: 10 }]}>
              <Text style={styles.summaryLabel}>Scheduled ride</Text>
              <Text style={styles.summaryValue}>
                {selectedDate} at {selectedTime}
              </Text>
            </View>

            <AppButton
              label="Confirm Booking"
              onPress={handleRequest}
              haptic="success"
              style={styles.ctaBtn}
            />
          </GlassCard>
        )}
      </MotiView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  stepsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  stepItem: { flexDirection: 'row', alignItems: 'center' },
  stepDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#374151' },
  stepDotActive: { backgroundColor: GOLD },
  stepLine: { width: 24, height: 1, backgroundColor: '#374151', marginHorizontal: 4 },
  card: { padding: 24 },
  title: { fontSize: 20, color: '#fff', fontWeight: '700', marginBottom: 6 },
  subtitle: { fontSize: 13, color: '#9ca3af', fontWeight: '500', marginBottom: 20 },
  inputIcon: { paddingLeft: 14, paddingRight: 4 },
  inputIconInline: { marginRight: 10 },
  inputContainer: { marginBottom: 14 },
  datePickerBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 14, marginBottom: 14, minHeight: 52,
  },
  datePickerText: { color: '#fff', fontSize: 15, fontWeight: '500', flex: 1 },
  summaryBox: {
    backgroundColor: 'rgba(212,175,55,0.08)', borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)', borderRadius: 12, padding: 14, marginBottom: 20,
  },
  summaryLabel: { color: GOLD, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  summaryValue: { color: '#fff', fontWeight: '700', fontSize: 15 },
  ctaBtn: { width: '100%', marginTop: 4 },
  optionBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)', borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.2)', borderRadius: 14, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 2,
  },
  optionBtnActive: { borderColor: GOLD, backgroundColor: 'rgba(212,175,55,0.08)' },
  optionIcon: {
    padding: 10, borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.4)', borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.2)', marginRight: 14,
  },
  optionInfo: { flex: 1 },
  optionTitle: { color: '#fff', fontWeight: '700', fontSize: 15, marginBottom: 2 },
  optionDesc: { color: '#9ca3af', fontSize: 13, fontWeight: '500' },
  errorText: { color: '#f87171', fontSize: 12, marginBottom: 8, marginLeft: 4 },
  switchBtn: { marginBottom: 20, minHeight: 44, justifyContent: 'center' },
  switchText: { color: GOLD, fontWeight: '700', fontSize: 13 },
});

const cal = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  container: {
    backgroundColor: '#1a1a2e', borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.4)', borderRadius: 16, padding: 16, width: '100%',
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  navBtn: { padding: 8, minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
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