import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { MotiView } from 'moti';
import {
  Calendar, Clock, Phone, Mail, ChevronRight, ChevronLeft,
  ArrowRightLeft, CheckCircle2, Plus, Minus, AlertCircle,
} from 'lucide-react-native';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';
import { AppScreen } from '../components/AppScreen';
import { TimePickerModal, formatTimeDisplay } from '../components/TimePickerModal';
import { useHaptics } from '../hooks/useHaptics';
import { useStaggerAnimation } from '../hooks/useStaggerAnimation';
import { useApp } from '../context/AppContext';
import { getHotelName } from '../config/defaultHotel';
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth,
  isSameDay, isBefore, startOfDay,
} from 'date-fns';

const GOLD = '#D4AF37';
const GOLD_FAINT = 'rgba(212,175,55,0.08)';
const GOLD_DIM = 'rgba(212,175,55,0.25)';
const BORDER = 'rgba(255,255,255,0.08)';
const SURFACE = 'rgba(255,255,255,0.04)';

const TYPE = {
  small: 11,
  body: 13,
  title: 15,
} as const;

type Step = 'guest' | 'schedule' | 'serviceType' | 'confirm';
const STEPS: Step[] = ['guest', 'schedule', 'serviceType', 'confirm'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const STEP_COPY: Record<Step, { title: string; subtitle: string }> = {
  guest: {
    title: 'Schedule a Ride',
    subtitle: 'Tracking link will be sent automatically to the guest.',
  },
  schedule: {
    title: 'Reserve a Ride',
    subtitle: "Choose the date and time for the guest's ride.",
  },
  serviceType: {
    title: 'Transfer or hourly',
    subtitle: 'Concierge rides use auto-assign. Manual chauffeur pick is for members in the passenger app only.',
  },
  confirm: {
    title: 'Confirm Booking',
    subtitle: 'Review and confirm the scheduled ride.',
  },
};

const MIN_HOURLY_HOURS = 2;
const MAX_HOURLY_HOURS = 12;
const QUICK_HOURS = [2, 3, 4, 6, 8, 12] as const;

function Segment({
  selected,
  onSelect,
  options,
}: {
  selected: string;
  onSelect: (id: string) => void;
  options: { id: string; label: string; icon: React.ReactNode }[];
}) {
  return (
    <View style={styles.segmentTrack}>
      {options.map((opt) => {
        const active = selected === opt.id;
        return (
          <Pressable
            key={opt.id}
            onPress={() => onSelect(opt.id)}
            style={({ pressed }) => [
              styles.segmentBtn,
              active && styles.segmentBtnActive,
              pressed && !active && styles.segmentBtnPressed,
            ]}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
          >
            {opt.icon}
            <Text style={[styles.segmentLabel, active && styles.segmentLabelActive]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function StepIndicator({ stepIndex }: { stepIndex: number }) {
  const progressPct = ((stepIndex + 1) / STEPS.length) * 100;
  return (
    <View style={styles.stepIndicator}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
      </View>
      <View style={styles.stepDotsRow}>
        {STEPS.map((s, i) => {
          const done = i < stepIndex;
          const active = i === stepIndex;
          return (
            <View
              key={s}
              style={[
                styles.stepDot,
                done && styles.stepDotDone,
                active && styles.stepDotActive,
              ]}
            >
              {done ? (
                <CheckCircle2 color="#000" size={12} strokeWidth={2.5} />
              ) : (
                <Text style={[styles.stepDotNum, active && styles.stepDotNumActive]}>
                  {i + 1}
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

function HourLimitModal({
  visible,
  title,
  message,
  onClose,
}: {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={limitModal.overlay} onPress={onClose}>
        <Pressable style={limitModal.card} onPress={(e) => e.stopPropagation()}>
          <View style={limitModal.iconWrap}>
            <AlertCircle color={GOLD} size={24} strokeWidth={2.4} />
          </View>
          <Text style={limitModal.title}>{title}</Text>
          <Text style={limitModal.message}>{message}</Text>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [limitModal.button, pressed && limitModal.buttonPressed]}
          >
            <Text style={limitModal.buttonText}>Got it</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const CalendarPicker = ({
  visible, onClose, onSelect, selected,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (date: Date) => void;
  selected: Date | null;
}) => {
  const [viewMonth, setViewMonth] = useState(selected || new Date());
  const today = startOfDay(new Date());
  const monthStart = startOfMonth(viewMonth);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(endOfMonth(viewMonth));
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={cal.overlay} onPress={onClose}>
        <Pressable style={cal.container} onPress={(e) => e.stopPropagation()}>
          <View style={cal.header}>
            <Pressable onPress={() => setViewMonth(subMonths(viewMonth, 1))} style={cal.navBtn}>
              <ChevronLeft color={GOLD} size={20} />
            </Pressable>
            <Text style={cal.monthLabel}>{format(viewMonth, 'MMMM yyyy')}</Text>
            <Pressable onPress={() => setViewMonth(addMonths(viewMonth, 1))} style={cal.navBtn}>
              <ChevronRight color={GOLD} size={20} />
            </Pressable>
          </View>
          <View style={cal.daysRow}>
            {DAYS.map((d) => (
              <Text key={d} style={cal.dayName}>{d}</Text>
            ))}
          </View>
          <View style={cal.grid}>
            {days.map((day, i) => {
              const isCurrentMonth = isSameMonth(day, viewMonth);
              const isPast = isBefore(day, today);
              const isSelected = selected ? isSameDay(day, selected) : false;
              const isToday = isSameDay(day, today);
              return (
                <Pressable
                  key={i}
                  disabled={isPast || !isCurrentMonth}
                  onPress={() => { onSelect(day); onClose(); }}
                  style={[
                    cal.dayCell,
                    isSelected && cal.dayCellSelected,
                    isToday && !isSelected && cal.dayCellToday,
                  ]}
                >
                  <Text
                    style={[
                      cal.dayText,
                      !isCurrentMonth && cal.dayTextOther,
                      isPast && cal.dayTextPast,
                      isSelected && cal.dayTextSelected,
                    ]}
                  >
                    {format(day, 'd')}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
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
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [serviceType, setServiceType] = useState<'transfer' | 'hourly'>('transfer');
  const [hourlyHours, setHourlyHours] = useState(MIN_HOURLY_HOURS);
  const [hourLimitMessage, setHourLimitMessage] = useState<{ title: string; message: string } | null>(null);
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [contactMethod, setContactMethod] = useState<'phone' | 'email'>('phone');

  const stepIndex = STEPS.indexOf(step);
  const copy = STEP_COPY[step];

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const handleEmailChange = (val: string) => {
    setGuestEmail(val);
    setEmailError(val && !validateEmail(val) ? 'Please enter a valid email address' : '');
  };

  const canProceedSchedule = selectedDate.length > 0 && selectedTime.length > 0;
  const canSubmitGuest =
    contactMethod === 'phone'
      ? guestPhone.length > 5
      : Boolean(guestEmail && validateEmail(guestEmail) && !emailError);

  const serviceHint =
    serviceType === 'transfer'
      ? 'Point A → point B when the guest adds a drop-off.'
      : 'Timed chauffeur service from pickup. Minimum 2 hours, maximum 12 hours.';

  const setHourlyDuration = async (nextHours: number) => {
    await light();
    if (nextHours < MIN_HOURLY_HOURS) {
      setHourlyHours(MIN_HOURLY_HOURS);
      setHourLimitMessage({
        title: 'Minimum 2 hours',
        message: 'Hourly rides must be booked for at least 2 hours.',
      });
      return;
    }
    if (nextHours > MAX_HOURLY_HOURS) {
      setHourlyHours(MAX_HOURLY_HOURS);
      setHourLimitMessage({
        title: 'Maximum 12 hours',
        message: 'Hourly rides can be booked for up to 12 hours only.',
      });
      return;
    }
    setHourlyHours(nextHours);
  };

  const goNext = async () => {
    await light();
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  };

  const goBack = async () => {
    await light();
    const idx = STEPS.indexOf(step);
    if (idx === 0) navigation.goBack();
    else setStep(STEPS[idx - 1]);
  };

  const handleRequest = () => {
    const pickup = getHotelName(user?.hotelName);
    const guestLabel = contactMethod === 'phone' ? guestPhone : guestEmail;
    const timeLabel = formatTimeDisplay(selectedTime);
    const durationLabel = serviceType === 'hourly' ? ` · ${hourlyHours} hours` : '';
    const scheduledFor = `${selectedDate} · ${timeLabel}${durationLabel}`;
    addOpenRideRequest({
      guestLabel,
      pickup,
      serviceType,
      status: 'awaiting_guest',
      scheduledFor,
      hourlyHours: serviceType === 'hourly' ? hourlyHours : undefined,
    });
    navigation.navigate('WaitingForPayment', {
      bookingMode: 'scheduled',
      scheduledDate: selectedDate,
      scheduledTime: timeLabel,
      guestPhone: contactMethod === 'phone' ? guestPhone : '',
      guestEmail: contactMethod === 'email' ? guestEmail : '',
      pickupLocation: pickup,
      serviceType,
      hourlyHours: serviceType === 'hourly' ? hourlyHours : undefined,
    });
  };

  const selectContact = async (method: 'phone' | 'email') => {
    await light();
    setContactMethod(method);
  };

  return (
    <AppScreen keyboardAvoiding noTopPad>
      <HourLimitModal
        visible={Boolean(hourLimitMessage)}
        title={hourLimitMessage?.title ?? ''}
        message={hourLimitMessage?.message ?? ''}
        onClose={() => setHourLimitMessage(null)}
      />

      <MotiView
        from={{ opacity: 0, translateY: -6 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 220, delay: delays.header }}
      >
        <StepIndicator stepIndex={stepIndex} />
      </MotiView>

      <MotiView
        key={step}
        from={{ opacity: 0, translateY: 12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 240, delay: delays.content }}
      >
        <AppCard style={styles.card}>
          {stepIndex > 0 ? (
            <Pressable
              onPress={goBack}
              style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <ChevronLeft color={GOLD} size={18} />
            </Pressable>
          ) : null}

          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.subtitle}>{copy.subtitle}</Text>

          {/* Step 1 — Guest */}
          {step === 'guest' && (
            <>
              <Segment
                selected={contactMethod}
                onSelect={(id) => selectContact(id as 'phone' | 'email')}
                options={[
                  {
                    id: 'phone',
                    label: 'Phone',
                    icon: <Phone color={contactMethod === 'phone' ? GOLD : '#6b7280'} size={15} />,
                  },
                  {
                    id: 'email',
                    label: 'Email',
                    icon: <Mail color={contactMethod === 'email' ? GOLD : '#6b7280'} size={15} />,
                  },
                ]}
              />

              <MotiView
                key={contactMethod}
                from={{ opacity: 0, translateY: 6 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 180 }}
                style={styles.fieldBlock}
              >
                <AppInput
                  leftSlot={
                    <View style={styles.inputIcon}>
                      {contactMethod === 'phone' ? (
                        <Phone color={GOLD} size={17} />
                      ) : (
                        <Mail color={GOLD} size={17} />
                      )}
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

              <Pressable
                onPress={async () => {
                  await light();
                  setContactMethod(contactMethod === 'phone' ? 'email' : 'phone');
                }}
                style={({ pressed }) => [styles.switchBtn, pressed && styles.switchBtnPressed]}
              >
                <Text style={styles.switchText}>
                  {contactMethod === 'phone'
                    ? 'No phone? Use Email instead'
                    : 'Use Phone Number instead'}
                </Text>
              </Pressable>

              <AppButton
                label="Send Ride Request"
                onPress={goNext}
                disabled={!canSubmitGuest}
                haptic="medium"
                style={styles.ctaBtn}
              />
            </>
          )}

          {/* Step 2 — Schedule */}
          {step === 'schedule' && (
            <>
              <CalendarPicker
                visible={calendarVisible}
                onClose={() => setCalendarVisible(false)}
                selected={selectedDateObj}
                onSelect={(date) => {
                  setSelectedDateObj(date);
                  setSelectedDate(format(date, 'yyyy-MM-dd'));
                }}
              />

              <Pressable
                style={({ pressed }) => [styles.datePickerBtn, pressed && styles.datePickerBtnPressed]}
                onPress={() => setCalendarVisible(true)}
              >
                <View style={styles.dateIconWrap}>
                  <Calendar color={GOLD} size={16} />
                </View>
                <Text style={[styles.datePickerText, !selectedDate && styles.datePickerPlaceholder]}>
                  {selectedDate || 'Select Date'}
                </Text>
                <ChevronRight color="rgba(255,255,255,0.25)" size={18} />
              </Pressable>

              <TimePickerModal
                visible={timePickerVisible}
                onClose={() => setTimePickerVisible(false)}
                selected={selectedTime}
                onSelect={setSelectedTime}
              />

              <Pressable
                style={({ pressed }) => [styles.datePickerBtn, pressed && styles.datePickerBtnPressed]}
                onPress={() => setTimePickerVisible(true)}
              >
                <View style={styles.dateIconWrap}>
                  <Clock color={GOLD} size={16} />
                </View>
                <Text style={[styles.datePickerText, !selectedTime && styles.datePickerPlaceholder]}>
                  {selectedTime ? formatTimeDisplay(selectedTime) : 'Time (HH:MM)'}
                </Text>
                <ChevronRight color="rgba(255,255,255,0.25)" size={18} />
              </Pressable>

              {canProceedSchedule ? (
                <MotiView
                  from={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'timing', duration: 200 }}
                  style={styles.summaryBox}
                >
                  <Text style={styles.summaryBoxLabel}>Scheduled For</Text>
                  <Text style={styles.summaryBoxValue}>
                    {selectedDate} at {formatTimeDisplay(selectedTime)}
                  </Text>
                </MotiView>
              ) : null}

              <AppButton
                label="Continue"
                onPress={goNext}
                disabled={!canProceedSchedule}
                haptic="medium"
                style={styles.ctaBtn}
              />
            </>
          )}

          {/* Step 3 — Service type */}
          {step === 'serviceType' && (
            <>
              <Segment
                selected={serviceType}
                onSelect={async (id) => {
                  await light();
                  setServiceType(id as 'transfer' | 'hourly');
                }}
                options={[
                  {
                    id: 'transfer',
                    label: 'Transfer',
                    icon: <ArrowRightLeft color={serviceType === 'transfer' ? GOLD : '#6b7280'} size={16} />,
                  },
                  {
                    id: 'hourly',
                    label: 'Hourly',
                    icon: <Clock color={serviceType === 'hourly' ? GOLD : '#6b7280'} size={16} />,
                  },
                ]}
              />
              <Text style={styles.segmentHint}>{serviceHint}</Text>

              {serviceType === 'hourly' ? (
                <MotiView
                  from={{ opacity: 0, translateY: 8 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: 'timing', duration: 180 }}
                  style={styles.hourCard}
                >
                  <View style={styles.hourHeader}>
                    <View>
                      <Text style={styles.hourLabel}>Duration</Text>
                      <Text style={styles.hourSub}>2 hour minimum · 12 hour maximum</Text>
                    </View>
                    <View style={styles.hourBadge}>
                      <Text style={styles.hourBadgeText}>{hourlyHours}h</Text>
                    </View>
                  </View>

                  <View style={styles.hourStepper}>
                    <Pressable
                      onPress={() => setHourlyDuration(hourlyHours - 1)}
                      style={({ pressed }) => [styles.hourStepBtn, pressed && styles.hourStepBtnPressed]}
                    >
                      <Minus color={GOLD} size={18} strokeWidth={2.5} />
                    </Pressable>

                    <View style={styles.hourValueWrap}>
                      <Text style={styles.hourValue}>{hourlyHours}</Text>
                      <Text style={styles.hourValueUnit}>hours</Text>
                    </View>

                    <Pressable
                      onPress={() => setHourlyDuration(hourlyHours + 1)}
                      style={({ pressed }) => [styles.hourStepBtn, pressed && styles.hourStepBtnPressed]}
                    >
                      <Plus color={GOLD} size={18} strokeWidth={2.5} />
                    </Pressable>
                  </View>

                  <View style={styles.hourChips}>
                    {QUICK_HOURS.map((hours) => {
                      const active = hourlyHours === hours;
                      return (
                        <Pressable
                          key={hours}
                          onPress={() => setHourlyDuration(hours)}
                          style={({ pressed }) => [
                            styles.hourChip,
                            active && styles.hourChipActive,
                            pressed && styles.hourChipPressed,
                          ]}
                        >
                          <Text style={[styles.hourChipText, active && styles.hourChipTextActive]}>
                            {hours}h
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </MotiView>
              ) : null}

              <AppButton label="Continue" onPress={goNext} haptic="medium" style={styles.ctaBtn} />
            </>
          )}

          {/* Step 4 — Confirm */}
          {step === 'confirm' && (
            <>
              <View style={styles.confirmCard}>
                <SummaryRow
                  label="Service"
                  value={serviceType === 'transfer' ? 'Transfer (A → B)' : `Hourly · ${hourlyHours} hours`}
                />
                <View style={styles.confirmDivider} />
                <SummaryRow
                  label="Scheduled ride"
                  value={`${selectedDate} at ${formatTimeDisplay(selectedTime)}`}
                />
              </View>

              <AppButton
                label="Confirm Booking"
                onPress={handleRequest}
                haptic="success"
                style={styles.ctaBtn}
              />
            </>
          )}
        </AppCard>
      </MotiView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  stepIndicator: {
    marginBottom: 14,
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: GOLD,
    borderRadius: 2,
  },
  stepDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: GOLD,
    borderColor: GOLD,
  },
  stepDotDone: {
    backgroundColor: GOLD,
    borderColor: GOLD,
  },
  stepDotNum: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
    fontWeight: '700',
  },
  stepDotNumActive: {
    color: '#000',
  },

  card: {
    padding: 14,
    paddingTop: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: GOLD_FAINT,
    borderWidth: 1,
    borderColor: GOLD_DIM,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  backBtnPressed: {
    opacity: 0.88,
  },
  title: {
    fontSize: TYPE.title,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: TYPE.small,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: '500',
    lineHeight: 16,
    marginBottom: 14,
  },

  segmentTrack: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: BORDER,
    gap: 4,
    marginBottom: 12,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 40,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  segmentBtnActive: {
    backgroundColor: GOLD_FAINT,
    borderWidth: 1,
    borderColor: GOLD_DIM,
  },
  segmentBtnPressed: {
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  segmentLabel: {
    color: '#6b7280',
    fontSize: TYPE.body,
    fontWeight: '600',
  },
  segmentLabelActive: {
    color: GOLD,
  },
  segmentHint: {
    fontSize: TYPE.small,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 14,
  },

  hourCard: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: GOLD_DIM,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  hourHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
  },
  hourLabel: {
    color: '#fff',
    fontSize: TYPE.title,
    fontWeight: '700',
    marginBottom: 3,
  },
  hourSub: {
    color: 'rgba(255,255,255,0.42)',
    fontSize: TYPE.small,
    fontWeight: '500',
  },
  hourBadge: {
    minWidth: 46,
    height: 34,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hourBadgeText: {
    color: '#000',
    fontSize: TYPE.body,
    fontWeight: '800',
  },
  hourStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  hourStepBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: GOLD_FAINT,
    borderWidth: 1,
    borderColor: GOLD_DIM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hourStepBtnPressed: {
    opacity: 0.86,
    backgroundColor: 'rgba(212,175,55,0.14)',
  },
  hourValueWrap: {
    flex: 1,
    minHeight: 66,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hourValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 32,
  },
  hourValueUnit: {
    color: GOLD,
    fontSize: TYPE.small,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginTop: 2,
  },
  hourChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hourChip: {
    minWidth: 45,
    minHeight: 34,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  hourChipActive: {
    borderColor: GOLD_DIM,
    backgroundColor: GOLD_FAINT,
  },
  hourChipPressed: {
    opacity: 0.9,
  },
  hourChipText: {
    color: 'rgba(255,255,255,0.52)',
    fontSize: TYPE.small,
    fontWeight: '700',
  },
  hourChipTextActive: {
    color: GOLD,
  },

  fieldBlock: {
    marginTop: 0,
  },
  inputIcon: {
    paddingLeft: 12,
    paddingRight: 4,
  },
  inputContainer: {
    marginBottom: 0,
  },
  errorText: {
    color: '#f87171',
    fontSize: TYPE.small,
    marginTop: 6,
    marginLeft: 2,
  },
  switchBtn: {
    marginTop: 12,
    marginBottom: 14,
    minHeight: 40,
    justifyContent: 'center',
  },
  switchBtnPressed: {
    opacity: 0.85,
  },
  switchText: {
    color: GOLD,
    fontWeight: '700',
    fontSize: TYPE.body,
  },

  datePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
    minHeight: 56,
  },
  datePickerBtnPressed: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  dateIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: GOLD_FAINT,
    borderWidth: 1,
    borderColor: GOLD_DIM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePickerText: {
    flex: 1,
    color: '#fff',
    fontSize: TYPE.body,
    fontWeight: '600',
  },
  datePickerPlaceholder: {
    color: '#6b7280',
    fontWeight: '500',
  },

  summaryBox: {
    backgroundColor: GOLD_FAINT,
    borderWidth: 1,
    borderColor: GOLD_DIM,
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
    marginBottom: 14,
  },
  summaryBoxLabel: {
    color: GOLD,
    fontSize: TYPE.small,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  summaryBoxValue: {
    color: '#fff',
    fontWeight: '700',
    fontSize: TYPE.body,
  },

  confirmCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 14,
  },
  summaryRow: {
    paddingVertical: 10,
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: TYPE.small,
    fontWeight: '500',
    marginBottom: 3,
  },
  summaryValue: {
    color: '#fff',
    fontWeight: '600',
    fontSize: TYPE.body,
    lineHeight: 18,
  },
  confirmDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: BORDER,
  },

  ctaBtn: {
    width: '100%',
  },
});

const limitModal = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: GOLD_DIM,
    backgroundColor: '#090909',
    padding: 20,
    alignItems: 'center',
  },
  iconWrap: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: GOLD_FAINT,
    borderWidth: 1,
    borderColor: GOLD_DIM,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: TYPE.body,
    fontWeight: '500',
    lineHeight: 19,
    textAlign: 'center',
    marginBottom: 18,
  },
  button: {
    width: '100%',
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.88,
  },
  buttonText: {
    color: '#000',
    fontSize: TYPE.body,
    fontWeight: '800',
  },
});

const cal = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: GOLD_DIM,
    borderRadius: 16,
    padding: 14,
    width: '100%',
    maxWidth: 360,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GOLD_FAINT,
  },
  monthLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: TYPE.title,
  },
  daysRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  dayName: {
    flex: 1,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.4)',
    fontSize: TYPE.small,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  dayCellSelected: {
    backgroundColor: GOLD,
  },
  dayCellToday: {
    borderWidth: 1,
    borderColor: GOLD_DIM,
  },
  dayText: {
    color: '#fff',
    fontSize: TYPE.body,
    fontWeight: '600',
  },
  dayTextOther: {
    color: '#374151',
  },
  dayTextPast: {
    color: '#374151',
  },
  dayTextSelected: {
    color: '#000',
    fontWeight: '800',
  },
});
