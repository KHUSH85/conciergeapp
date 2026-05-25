import React, { useEffect, useMemo, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MotiView } from 'moti';
import {
  CheckCircle2,
  Crown,
  ExternalLink,
  MessageCircle,
  RefreshCw,
  Send,
  ShieldCheck,
  Smartphone,
} from 'lucide-react-native';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { AppScreen } from '../components/AppScreen';
import { useHaptics } from '../hooks/useHaptics';
import { useStaggerAnimation } from '../hooks/useStaggerAnimation';
import { PASSENGER_WEB_BASE_URL } from '../config/passengerWeb';

const GOLD = '#D4AF37';
const GOLD_FAINT = 'rgba(212,175,55,0.08)';
const GOLD_DIM = 'rgba(212,175,55,0.25)';
const GREEN = '#22c55e';
const BORDER = 'rgba(255,255,255,0.08)';
const SURFACE = 'rgba(255,255,255,0.04)';

const DEMO_RIDE_ID = 'demo-ride-2401';
const APP_STORE_URL = 'https://apps.apple.com/app/tuxedo-passenger';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.tuxedo.passenger';

type SmsEvent = 'app_download_offer' | 'membership_after_ride_start';
type SentState = Record<SmsEvent, boolean>;

const DEFAULT_SENT: SentState = {
  app_download_offer: false,
  membership_after_ride_start: false,
};

function sentKey(event: SmsEvent) {
  return `tuxedo:sms-preview:${DEMO_RIDE_ID}:${event}`;
}

function SmsBubble({
  title,
  body,
  onOpen,
}: {
  title: string;
  body: string;
  onOpen: () => void;
}) {
  return (
    <Pressable
      onPress={onOpen}
      style={({ pressed }) => [styles.smsBubble, pressed && styles.smsBubblePressed]}
      accessibilityRole="button"
    >
      <View style={styles.smsTop}>
        <MessageCircle color={GOLD} size={14} />
        <Text style={styles.smsTitle}>{title}</Text>
        <ExternalLink color="rgba(255,255,255,0.35)" size={13} />
      </View>
      <Text style={styles.smsBody}>{body}</Text>
    </Pressable>
  );
}

function SmsDemoCard({
  index,
  icon,
  eyebrow,
  title,
  trigger,
  eventKey,
  sent,
  sendDisabled,
  onSend,
  onOpen,
  smsTitle,
  smsBody,
  children,
}: {
  index: number;
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  trigger: string;
  eventKey: SmsEvent;
  sent: boolean;
  sendDisabled?: boolean;
  onSend: (event: SmsEvent) => void;
  onOpen: () => void;
  smsTitle: string;
  smsBody: string;
  children?: React.ReactNode;
}) {
  return (
    <AppCard style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.eventIcon}>{icon}</View>
        <View style={styles.cardTitleCol}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <View style={[styles.sentPill, sent && styles.sentPillActive]}>
          {sent ? <CheckCircle2 color={GREEN} size={12} /> : <Send color={GOLD} size={12} />}
          <Text style={[styles.sentPillText, sent && styles.sentPillTextActive]}>
            {sent ? 'Sent' : `SMS ${index}`}
          </Text>
        </View>
      </View>

      <View style={styles.triggerBox}>
        <Text style={styles.triggerLabel}>Trigger</Text>
        <Text style={styles.triggerText}>{trigger}</Text>
      </View>

      <SmsBubble title={smsTitle} body={smsBody} onOpen={onOpen} />

      {children}

      <AppButton
        label={sent ? 'Already sent for this ride/event' : 'Mark SMS as sent'}
        onPress={() => onSend(eventKey)}
        disabled={sent || sendDisabled}
        haptic="medium"
        style={styles.sendBtn}
      />

      <Text style={styles.ruleText}>
        Rule: once sent for {DEMO_RIDE_ID} + {eventKey}, this SMS will not send again.
      </Text>
    </AppCard>
  );
}

export const SmsPreviewLabScreen = () => {
  const { light, success } = useHaptics();
  const delays = useStaggerAnimation();
  const [sent, setSent] = useState<SentState>(DEFAULT_SENT);
  const [rideStarted, setRideStarted] = useState(false);

  const trackLink = `${PASSENGER_WEB_BASE_URL}/track-ride?token=SMSDEMO&pickup=The+Grand+Majestic+Hotel`;
  const membershipLink = `${PASSENGER_WEB_BASE_URL}/membership?rideId=${DEMO_RIDE_ID}&source=sms_membership_offer`;

  const smsCopy = useMemo(
    () => ({
      app: `Your Tuxedo ride is ready. Download the passenger app to track your chauffeur and manage your ride.\n\nApp Store: ${APP_STORE_URL}\nGoogle Play: ${PLAY_STORE_URL}\nTrack now: ${trackLink}`,
      membership: `Your Tuxedo ride has started. Upgrade to Tuxedo Gold for chauffeur choice, premium amenities, priority service, and ride credit.\n\nOpen membership: ${membershipLink}`,
    }),
    [membershipLink, trackLink],
  );

  useEffect(() => {
    let mounted = true;
    async function loadSentState() {
      const entries = await AsyncStorage.multiGet([
        sentKey('app_download_offer'),
        sentKey('membership_after_ride_start'),
      ]);
      if (!mounted) return;
      setSent({
        app_download_offer: entries[0]?.[1] === 'true',
        membership_after_ride_start: entries[1]?.[1] === 'true',
      });
    }
    void loadSentState();
    return () => {
      mounted = false;
    };
  }, []);

  const markSent = async (event: SmsEvent) => {
    if (sent[event]) return;
    await success();
    await AsyncStorage.setItem(sentKey(event), 'true');
    setSent((prev) => ({ ...prev, [event]: true }));
  };

  const resetDemo = async () => {
    await light();
    await AsyncStorage.multiRemove([
      sentKey('app_download_offer'),
      sentKey('membership_after_ride_start'),
    ]);
    setSent(DEFAULT_SENT);
    setRideStarted(false);
  };

  return (
    <AppScreen noTopPad>
      <MotiView
        from={{ opacity: 0, translateY: 8 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 220, delay: delays.header }}
      >
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <MessageCircle color={GOLD} size={22} />
          </View>
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>SMS Preview Lab</Text>
            <Text style={styles.heroSub}>
              Development screen to show client SMS timing, copy, links, and no-repeat behavior.
            </Text>
          </View>
        </View>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 220, delay: delays.content }}
      >
        <AppCard style={styles.rideCard}>
          <View style={styles.rideTop}>
            <View>
              <Text style={styles.rideLabel}>Demo ride</Text>
              <Text style={styles.rideId}>{DEMO_RIDE_ID}</Text>
            </View>
            <View style={[styles.statusBadge, rideStarted && styles.statusBadgeActive]}>
              <Text style={[styles.statusBadgeText, rideStarted && styles.statusBadgeTextActive]}>
                {rideStarted ? 'Ride started' : 'Before ride start'}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={async () => {
              await light();
              setRideStarted((prev) => !prev);
            }}
            style={({ pressed }) => [styles.startToggle, pressed && styles.startTogglePressed]}
          >
            <Text style={styles.startToggleText}>
              {rideStarted ? 'Set ride before start' : 'Simulate ride started'}
            </Text>
          </Pressable>
        </AppCard>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 220, delay: delays.item(1) }}
      >
        <SmsDemoCard
          index={1}
          icon={<Smartphone color={GOLD} size={18} />}
          eyebrow="SMS 1"
          title="App download offer"
          trigger="Sent after concierge creates the ride request."
          eventKey="app_download_offer"
          sent={sent.app_download_offer}
          onSend={markSent}
          onOpen={() => Linking.openURL(APP_STORE_URL)}
          smsTitle="Tap SMS to download app"
          smsBody={smsCopy.app}
        >
          <View style={styles.linkRow}>
            <Pressable onPress={() => Linking.openURL(APP_STORE_URL)} style={styles.linkChip}>
              <Text style={styles.linkChipText}>Open App Store</Text>
            </Pressable>
            <Pressable onPress={() => Linking.openURL(PLAY_STORE_URL)} style={styles.linkChip}>
              <Text style={styles.linkChipText}>Open Google Play</Text>
            </Pressable>
          </View>
        </SmsDemoCard>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 220, delay: delays.item(2) }}
      >
        <SmsDemoCard
          index={2}
          icon={<Crown color={GOLD} size={18} />}
          eyebrow="SMS 2"
          title="Membership offer"
          trigger="Sent only after the ride starts."
          eventKey="membership_after_ride_start"
          sent={sent.membership_after_ride_start}
          sendDisabled={!rideStarted}
          onSend={markSent}
          onOpen={() => Linking.openURL(membershipLink)}
          smsTitle="Tap SMS to open membership"
          smsBody={smsCopy.membership}
        >
          {!rideStarted ? (
            <View style={styles.waitingNotice}>
              <ShieldCheck color={GOLD} size={14} />
              <Text style={styles.waitingNoticeText}>
                SMS 2 is locked until the ride status becomes started/onboard.
              </Text>
            </View>
          ) : null}
        </SmsDemoCard>
      </MotiView>

      <Pressable
        onPress={resetDemo}
        style={({ pressed }) => [styles.resetBtn, pressed && styles.resetBtnPressed]}
      >
        <RefreshCw color="rgba(255,255,255,0.42)" size={14} />
        <Text style={styles.resetText}>Reset demo send state</Text>
      </Pressable>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: GOLD_DIM,
    backgroundColor: GOLD_FAINT,
    marginBottom: 12,
  },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: GOLD_DIM,
  },
  heroCopy: {
    flex: 1,
    minWidth: 0,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 3,
  },
  heroSub: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 17,
  },
  rideCard: {
    padding: 14,
    marginBottom: 12,
  },
  rideTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  rideLabel: {
    color: GOLD,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  rideId: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  statusBadge: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusBadgeActive: {
    borderColor: 'rgba(34,197,94,0.32)',
    backgroundColor: 'rgba(34,197,94,0.08)',
  },
  statusBadgeText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  statusBadgeTextActive: {
    color: GREEN,
  },
  startToggle: {
    minHeight: 44,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: GOLD_DIM,
    backgroundColor: GOLD_FAINT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startTogglePressed: {
    opacity: 0.86,
  },
  startToggleText: {
    color: GOLD,
    fontSize: 13,
    fontWeight: '800',
  },
  card: {
    padding: 14,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  eventIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GOLD_DIM,
    backgroundColor: GOLD_FAINT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitleCol: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    color: GOLD,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
  sentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: GOLD_DIM,
    backgroundColor: GOLD_FAINT,
  },
  sentPillActive: {
    borderColor: 'rgba(34,197,94,0.28)',
    backgroundColor: 'rgba(34,197,94,0.08)',
  },
  sentPillText: {
    color: GOLD,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  sentPillTextActive: {
    color: GREEN,
  },
  triggerBox: {
    borderRadius: 13,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
    padding: 11,
    marginBottom: 10,
  },
  triggerLabel: {
    color: 'rgba(255,255,255,0.38)',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  triggerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
  },
  smsBubble: {
    borderRadius: 18,
    borderTopLeftRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 12,
    marginBottom: 10,
  },
  smsBubblePressed: {
    opacity: 0.88,
  },
  smsTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 8,
  },
  smsTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  smsBody: {
    color: 'rgba(255,255,255,0.68)',
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 16,
  },
  linkRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  linkChip: {
    flex: 1,
    minHeight: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GOLD_DIM,
    backgroundColor: GOLD_FAINT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  linkChipText: {
    color: GOLD,
    fontSize: 11,
    fontWeight: '800',
  },
  waitingNotice: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: GOLD_DIM,
    backgroundColor: GOLD_FAINT,
    padding: 10,
    marginBottom: 10,
  },
  waitingNoticeText: {
    flex: 1,
    color: 'rgba(255,255,255,0.58)',
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 16,
  },
  sendBtn: {
    width: '100%',
  },
  ruleText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 15,
    textAlign: 'center',
    marginTop: 9,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    minHeight: 44,
    borderRadius: 12,
    marginTop: 2,
    marginBottom: 12,
  },
  resetBtnPressed: {
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  resetText: {
    color: 'rgba(255,255,255,0.42)',
    fontSize: 12,
    fontWeight: '700',
  },
});
