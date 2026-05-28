import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Share, Linking } from 'react-native';
import { MotiView } from 'moti';
import {
  RefreshCw, ArrowLeft, Send,
  ArrowRightLeft, Clock, MapPin, Calendar,
  Link, Copy, CheckCircle2, ExternalLink, Sparkles,
} from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { AppScreen } from '../components/AppScreen';
import { useHaptics } from '../hooks/useHaptics';
import { useStaggerAnimation } from '../hooks/useStaggerAnimation';

const GOLD = '#D4AF37';
const GOLD_FAINT = 'rgba(212,175,55,0.08)';
const GOLD_DIM = 'rgba(212,175,55,0.25)';
const GREEN = '#22c55e';
const BORDER = 'rgba(255,255,255,0.08)';

const TYPE = {
  caption: 10,
  small: 11,
  body: 13,
  title: 17,
} as const;

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.metaRow}>
      <View style={styles.metaIconWrap}>{icon}</View>
      <View style={styles.metaTextCol}>
        <Text style={styles.metaLabel}>{label}</Text>
        <Text style={styles.metaValue} numberOfLines={2}>
          {value}
        </Text>
      </View>
    </View>
  );
}

export const WaitingForPaymentScreen = ({ navigation, route }: any) => {
  const { light } = useHaptics();
  const delays = useStaggerAnimation();
  const [resent, setResent] = useState(false);
  const [copied, setCopied] = useState(false);

  const serviceType = route?.params?.serviceType as 'transfer' | 'hourly' | undefined;
  const pickup = route?.params?.pickupLocation as string | undefined;
  const passengerLink = route?.params?.passengerLink as string | undefined;
  const premiumAddOns = (route?.params?.premiumAddOns ?? []) as string[];
  const scheduledDate = route?.params?.scheduledDate as string | undefined;
  const scheduledTime = route?.params?.scheduledTime as string | undefined;
  const hourlyHours = route?.params?.hourlyHours as number | undefined;

  const hasMeta = Boolean(serviceType || scheduledDate || pickup);

  const handleResend = async () => {
    await light();
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  };

  const handleCopy = async () => {
    if (!passengerLink) return;
    await light();
    try {
      await Clipboard.setStringAsync(passengerLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* ignore clipboard failures */
    }
  };

  const handleShare = async () => {
    if (!passengerLink) return;
    await light();
    Share.share({
      message: `Your Tuxedo chauffeur is ready. Tap to track your ride: ${passengerLink}`,
      url: passengerLink,
    });
  };

  const handleOpenPreview = async () => {
    if (!passengerLink) return;
    await light();
    Linking.openURL(passengerLink);
  };

  return (
    <AppScreen noTopPad>
      {/* Status hero */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 240, delay: delays.header }}
      >
        <AppCard variant="gold" style={styles.statusCard}>
          <View style={styles.statusTop}>
            <View style={styles.spinnerWrap}>
              <MotiView
                from={{ rotate: '0deg' }}
                animate={{ rotate: '360deg' }}
                transition={{ type: 'timing', duration: 1400, loop: true }}
                style={styles.spinner}
              />
              <View style={styles.spinnerInner}>
                <Send color={GOLD} size={18} />
              </View>
            </View>

            <View style={styles.statusCopy}>
              <Text style={styles.title}>Request Sent</Text>
              <Text style={styles.subtitle}>
                Tracking link delivered to guest.{'\n'}
                Waiting for destination and payment.
              </Text>
            </View>
          </View>

          <View style={styles.statusPill}>
            <MotiView
              from={{ opacity: 0.35 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'timing', duration: 900, loop: true }}
              style={styles.statusDot}
            />
            <Text style={styles.statusText}>Chauffeur Radar Active</Text>
          </View>
        </AppCard>
      </MotiView>

      {/* Trip summary */}
      {hasMeta ? (
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 220, delay: delays.content }}
        >
          <AppCard style={styles.metaCard}>
            {serviceType ? (
              <MetaRow
                icon={
                  serviceType === 'transfer' ? (
                    <ArrowRightLeft color={GOLD} size={14} />
                  ) : (
                    <Clock color={GOLD} size={14} />
                  )
                }
                label="Service:"
                value={serviceType === 'transfer' ? 'Transfer (A → B)' : `Hourly${hourlyHours ? ` · ${hourlyHours} hours` : ''}`}
              />
            ) : null}
            {pickup ? (
              <>
                {serviceType ? <View style={styles.metaDivider} /> : null}
                <MetaRow
                  icon={<MapPin color={GOLD} size={14} />}
                  label="Pickup:"
                  value={pickup}
                />
              </>
            ) : null}
            {scheduledDate ? (
              <>
                {(serviceType || pickup) ? <View style={styles.metaDivider} /> : null}
                <MetaRow
                  icon={<Calendar color={GOLD} size={14} />}
                  label="Scheduled:"
                  value={`${scheduledDate}${scheduledTime ? ` · ${scheduledTime}` : ''}`}
                />
              </>
            ) : null}
          </AppCard>
        </MotiView>
      ) : null}

      {/* Premium options summary */}
      {premiumAddOns.length > 0 ? (
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 220, delay: delays.content + 20 }}
        >
          <AppCard style={styles.addOnsCard}>
            <View style={styles.addOnsHeader}>
              <View style={styles.addOnsIconWrap}>
                <Sparkles color={GOLD} size={14} />
              </View>
              <View style={styles.linkTitleCol}>
                <Text style={styles.linkTitle}>Selected premium options</Text>
                <Text style={styles.linkSub}>{premiumAddOns.length} option{premiumAddOns.length === 1 ? '' : 's'} attached to this request</Text>
              </View>
            </View>
            <View style={styles.addOnsChips}>
              {premiumAddOns.map((item) => (
                <View key={item} style={styles.addOnChip}>
                  <Text style={styles.addOnChipText}>{item}</Text>
                </View>
              ))}
            </View>
          </AppCard>
        </MotiView>
      ) : null}

      {/* Passenger link preview */}
      {passengerLink ? (
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 220, delay: delays.content + 40 }}
        >
          <AppCard style={styles.linkCard}>
            <View style={styles.linkHeader}>
              <View style={styles.linkIconWrap}>
                <Link color={GOLD} size={14} />
              </View>
              <View style={styles.linkTitleCol}>
                <Text style={styles.linkTitle}>Preview tracking link</Text>
                <Text style={styles.linkSub}>Visible after the request is sent</Text>
              </View>
            </View>

            <View style={styles.linkBox}>
              <Text style={styles.linkText} numberOfLines={3} selectable>
                {passengerLink}
              </Text>
            </View>

            <View style={styles.linkActions}>
              <Pressable
                onPress={handleOpenPreview}
                style={({ pressed }) => [styles.linkActionBtn, pressed && styles.linkActionBtnPressed]}
                accessibilityRole="button"
              >
                <ExternalLink color={GOLD} size={14} />
                <Text style={styles.linkActionText}>Preview</Text>
              </Pressable>

              <Pressable
                onPress={handleCopy}
                style={({ pressed }) => [
                  styles.linkActionBtn,
                  copied && styles.linkActionBtnSuccess,
                  pressed && styles.linkActionBtnPressed,
                ]}
                accessibilityRole="button"
              >
                {copied ? <CheckCircle2 color={GREEN} size={14} /> : <Copy color={GOLD} size={14} />}
                <Text style={[styles.linkActionText, copied && styles.linkActionTextSuccess]}>
                  {copied ? 'Copied!' : 'Copy link'}
                </Text>
              </Pressable>

              <Pressable
                onPress={handleShare}
                style={({ pressed }) => [styles.linkActionBtn, pressed && styles.linkActionBtnPressed]}
                accessibilityRole="button"
              >
                <Link color={GOLD} size={14} />
                <Text style={styles.linkActionText}>Share</Text>
              </Pressable>
            </View>
          </AppCard>
        </MotiView>
      ) : null}

      {/* Actions */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 240, delay: delays.cta }}
        style={styles.actionsWrap}
      >
        <AppButton
          label="Return to Dashboard"
          onPress={() => navigation.navigate('ConciergeHome')}
          style={styles.primaryBtn}
        />

        <Pressable
          onPress={handleResend}
          style={({ pressed }) => [
            styles.resendBtn,
            resent && styles.resendBtnSuccess,
            pressed && styles.resendBtnPressed,
          ]}
          accessibilityRole="button"
        >
          <RefreshCw color={resent ? GREEN : GOLD} size={15} />
          <Text style={[styles.resendText, resent && styles.resendTextSent]}>
            {resent ? 'Link Resent!' : 'Resend Tracking Link'}
          </Text>
        </Pressable>

        <Pressable
          onPress={async () => {
            await light();
            navigation.goBack();
          }}
          style={({ pressed }) => [styles.backRow, pressed && styles.backRowPressed]}
          accessibilityRole="button"
        >
          <ArrowLeft color="rgba(255,255,255,0.35)" size={14} />
          <Text style={styles.backText}>Back to Guest Details</Text>
        </Pressable>
      </MotiView>

      {/* Footer */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', duration: 260, delay: delays.cta + 60 }}
        style={styles.footerWrap}
      >
        <Text style={styles.footer}>
          You will be notified when the guest completes payment. Future jobs can broadcast to chauffeurs — first to accept wins; cancel and penalty rules are set on the back end.
        </Text>
      </MotiView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  statusCard: {
    padding: 16,
    marginBottom: 10,
  },
  statusTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 14,
  },
  spinnerWrap: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  spinner: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: GOLD,
    borderTopColor: 'transparent',
  },
  spinnerInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: GOLD_FAINT,
    borderWidth: 1,
    borderColor: GOLD_DIM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCopy: {
    flex: 1,
    minWidth: 0,
    paddingTop: 4,
  },
  title: {
    fontSize: TYPE.title,
    color: '#fff',
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: TYPE.body,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '500',
    lineHeight: 19,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 7,
    backgroundColor: GOLD_FAINT,
    borderWidth: 1,
    borderColor: GOLD_DIM,
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: GOLD,
  },
  statusText: {
    color: GOLD,
    fontSize: TYPE.small,
    fontWeight: '700',
    letterSpacing: 0.4,
  },

  metaCard: {
    padding: 4,
    paddingVertical: 6,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  metaIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: GOLD_FAINT,
    borderWidth: 1,
    borderColor: GOLD_DIM,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  metaTextCol: {
    flex: 1,
    minWidth: 0,
  },
  metaLabel: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: TYPE.small,
    fontWeight: '500',
    marginBottom: 2,
  },
  metaValue: {
    color: '#fff',
    fontSize: TYPE.body,
    fontWeight: '600',
    lineHeight: 18,
  },
  metaDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: BORDER,
    marginLeft: 52,
  },

  addOnsCard: {
    padding: 14,
    marginBottom: 10,
  },
  addOnsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  addOnsIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: GOLD_FAINT,
    borderWidth: 1,
    borderColor: GOLD_DIM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addOnsChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  addOnChip: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: GOLD_FAINT,
    borderWidth: 1,
    borderColor: GOLD_DIM,
  },
  addOnChipText: {
    color: GOLD,
    fontSize: TYPE.small,
    fontWeight: '700',
  },

  linkCard: {
    padding: 14,
    marginBottom: 10,
  },
  linkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  linkIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: GOLD_FAINT,
    borderWidth: 1,
    borderColor: GOLD_DIM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkTitleCol: {
    flex: 1,
    minWidth: 0,
  },
  linkTitle: {
    color: '#fff',
    fontSize: TYPE.body,
    fontWeight: '700',
  },
  linkSub: {
    color: 'rgba(255,255,255,0.42)',
    fontSize: TYPE.small,
    fontWeight: '500',
    marginTop: 2,
  },
  linkBox: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 10,
  },
  linkText: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: TYPE.small,
    fontWeight: '500',
    lineHeight: 16,
  },
  linkActions: {
    flexDirection: 'row',
    gap: 8,
  },
  linkActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 42,
    paddingHorizontal: 10,
    backgroundColor: GOLD_FAINT,
    borderWidth: 1,
    borderColor: GOLD_DIM,
    borderRadius: 10,
  },
  linkActionBtnPressed: {
    opacity: 0.9,
  },
  linkActionBtnSuccess: {
    backgroundColor: 'rgba(34,197,94,0.08)',
    borderColor: 'rgba(34,197,94,0.28)',
  },
  linkActionText: {
    color: GOLD,
    fontSize: TYPE.small,
    fontWeight: '700',
  },
  linkActionTextSuccess: {
    color: GREEN,
  },

  actionsWrap: {
    marginTop: 4,
    gap: 10,
    paddingTop: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BORDER,
  },
  primaryBtn: {
    width: '100%',
  },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GOLD_DIM,
    backgroundColor: GOLD_FAINT,
  },
  resendBtnPressed: {
    opacity: 0.9,
  },
  resendBtnSuccess: {
    borderColor: 'rgba(34,197,94,0.35)',
    backgroundColor: 'rgba(34,197,94,0.08)',
  },
  resendText: {
    color: GOLD,
    fontSize: TYPE.body,
    fontWeight: '600',
  },
  resendTextSent: {
    color: GREEN,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 44,
    borderRadius: 10,
  },
  backRowPressed: {
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  backText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: TYPE.body,
    fontWeight: '500',
  },

  footerWrap: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BORDER,
  },
  footer: {
    color: 'rgba(255,255,255,0.32)',
    fontSize: TYPE.small,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 17,
  },
});
