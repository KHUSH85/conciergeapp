import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Clock } from 'lucide-react-native';
import { format } from 'date-fns';

const GOLD = '#D4AF37';
const GOLD_FAINT = 'rgba(212,175,55,0.08)';
const GOLD_DIM = 'rgba(212,175,55,0.25)';
const BORDER = 'rgba(255,255,255,0.08)';

const ITEM_H = 44;
const VISIBLE_ROWS = 3;
const WHEEL_H = ITEM_H * VISIBLE_ROWS;

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));
const PERIODS = ['AM', 'PM'] as const;

type Period = (typeof PERIODS)[number];

export function defaultPickerTime(): Date {
  const d = new Date();
  const rounded = Math.ceil(d.getMinutes() / 5) * 5;
  d.setMinutes(rounded >= 60 ? 0 : rounded, 0, 0);
  if (rounded >= 60) d.setHours(d.getHours() + 1);
  return d;
}

export function parseTimeString(timeStr: string): Date {
  if (!timeStr) return defaultPickerTime();
  const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return defaultPickerTime();
  const d = new Date();
  d.setHours(parseInt(match[1], 10), parseInt(match[2], 10), 0, 0);
  return d;
}

export function formatTimeStorage(date: Date): string {
  return format(date, 'HH:mm');
}

export function formatTimeDisplay(timeStr: string): string {
  if (!timeStr) return '';
  return format(parseTimeString(timeStr), 'h:mm a');
}

function dateToWheels(date: Date) {
  const h24 = date.getHours();
  const period: Period = h24 >= 12 ? 'PM' : 'AM';
  let hour12 = h24 % 12;
  if (hour12 === 0) hour12 = 12;
  const rawMin = date.getMinutes();
  const minute = String(Math.min(55, Math.round(rawMin / 5) * 5)).padStart(2, '0');
  return { hour: String(hour12), minute, period };
}

function wheelsToDate(hour: string, minute: string, period: Period): Date {
  let h = parseInt(hour, 10) % 12;
  if (period === 'PM') h += 12;
  if (period === 'AM' && hour === '12') h = 0;
  if (period === 'PM' && hour === '12') h = 12;
  const d = new Date();
  d.setHours(h, parseInt(minute, 10), 0, 0);
  return d;
}

function WheelColumn({
  items,
  value,
  onChange,
}: {
  items: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const scrollRef = useRef<ScrollView>(null);
  const pad = Math.floor(VISIBLE_ROWS / 2);

  useEffect(() => {
    const idx = Math.max(0, items.indexOf(value));
    const t = setTimeout(() => {
      scrollRef.current?.scrollTo({ y: idx * ITEM_H, animated: false });
    }, 50);
    return () => clearTimeout(t);
  }, [items, value]);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.y / ITEM_H);
    const clamped = Math.max(0, Math.min(items.length - 1, idx));
    if (items[clamped] !== value) onChange(items[clamped]);
  };

  return (
    <View style={styles.wheelCol}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        onMomentumScrollEnd={onScrollEnd}
        contentContainerStyle={{ paddingVertical: ITEM_H * pad }}
      >
        {items.map((item) => {
          const active = item === value;
          return (
            <Pressable
              key={item}
              onPress={() => onChange(item)}
              style={styles.wheelItem}
            >
              <Text style={[styles.wheelText, active && styles.wheelTextActive]}>{item}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <View style={styles.wheelHighlight} pointerEvents="none" />
    </View>
  );
}

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (time: string) => void;
  selected: string;
};

export function TimePickerModal({ visible, onClose, onSelect, selected }: Props) {
  const initial = dateToWheels(parseTimeString(selected));
  const [hour, setHour] = useState(initial.hour);
  const [minute, setMinute] = useState(initial.minute);
  const [period, setPeriod] = useState<Period>(initial.period);

  useEffect(() => {
    if (!visible) return;
    const w = dateToWheels(parseTimeString(selected));
    setHour(w.hour);
    setMinute(w.minute);
    setPeriod(w.period);
  }, [visible, selected]);

  const previewDate = wheelsToDate(hour, minute, period);

  const handleDone = () => {
    onSelect(formatTimeStorage(previewDate));
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Clock color={GOLD} size={18} />
            <Text style={styles.title}>Time (HH:MM)</Text>
          </View>

          <Text style={styles.preview}>{format(previewDate, 'h:mm a')}</Text>

          <View style={styles.wheelsRow}>
            <WheelColumn items={HOURS} value={hour} onChange={setHour} />
            <Text style={styles.colon}>:</Text>
            <WheelColumn items={MINUTES} value={minute} onChange={setMinute} />
            <WheelColumn items={PERIODS} value={period} onChange={(v) => setPeriod(v as Period)} />
          </View>

          <View style={styles.actions}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.actionBtn, styles.cancelBtn, pressed && styles.pressed]}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleDone}
              style={({ pressed }) => [styles.actionBtn, styles.doneBtn, pressed && styles.pressed]}
            >
              <Text style={styles.doneText}>Set time</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    padding: 16,
    width: '100%',
    maxWidth: 340,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  preview: {
    color: GOLD,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  wheelsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  wheelCol: {
    width: 72,
    height: WHEEL_H,
    overflow: 'hidden',
  },
  wheelItem: {
    height: ITEM_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 20,
    fontWeight: '600',
  },
  wheelTextActive: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  wheelHighlight: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: ITEM_H,
    height: ITEM_H,
    borderRadius: 8,
    backgroundColor: GOLD_FAINT,
    borderWidth: 1,
    borderColor: GOLD_DIM,
  },
  colon: {
    color: GOLD,
    fontSize: 22,
    fontWeight: '700',
    marginHorizontal: 2,
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  actionBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  doneBtn: {
    backgroundColor: GOLD,
  },
  pressed: {
    opacity: 0.9,
  },
  cancelText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
    fontWeight: '600',
  },
  doneText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '700',
  },
});
