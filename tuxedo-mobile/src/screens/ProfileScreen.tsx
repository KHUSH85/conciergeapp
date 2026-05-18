import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import {
  Crown, Shield, Smartphone, Mail, Phone, Building2, CheckCircle2,
} from 'lucide-react-native';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { AppScreen } from '../components/AppScreen';
import { useStaggerAnimation } from '../hooks/useStaggerAnimation';
import { useApp } from '../context/AppContext';

const GOLD = '#D4AF37';
const GOLD_FAINT = 'rgba(212,175,55,0.08)';
const GOLD_DIM = 'rgba(212,175,55,0.25)';
const BORDER = 'rgba(255,255,255,0.08)';
const SURFACE = 'rgba(255,255,255,0.04)';
const GREEN = '#22c55e';

const TYPE = {
  caption: 10,
  small: 11,
  body: 13,
  title: 16,
  name: 20,
} as const;

function kycStyle(status?: string) {
  if (status === 'approved') return { color: GREEN, bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)' };
  if (status === 'rejected') return { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)' };
  return { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' };
}

function DetailRow({
  icon: Icon,
  label,
  value,
  valueColor,
  isLast,
}: {
  icon: React.ComponentType<{ color: string; size: number }>;
  label: string;
  value: string;
  valueColor?: string;
  isLast?: boolean;
}) {
  return (
    <>
      <View style={styles.detailRow}>
        <View style={styles.detailIconWrap}>
          <Icon color={GOLD} size={16} />
        </View>
        <View style={styles.detailText}>
          <Text style={styles.detailLabel}>{label}</Text>
          <Text style={[styles.detailValue, valueColor ? { color: valueColor } : null]} numberOfLines={2}>
            {value}
          </Text>
        </View>
      </View>
      {!isLast ? <View style={styles.divider} /> : null}
    </>
  );
}

export const ProfileScreen = () => {
  const { user, setUser } = useApp();
  const delays = useStaggerAnimation();

  const kyc = kycStyle(user?.kycStatus);
  const roleLabel = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : 'Concierge';

  const initials = (user?.name || 'James Anderson')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  return (
    <AppScreen brandHeader brandShowProfile={false}>
      {/* Hero */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 240, delay: delays.header }}
      >
        <AppCard variant="gold" style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
              {user?.isMember ? (
                <View style={styles.crownBadge}>
                  <Crown color="#000" size={11} />
                </View>
              ) : null}
            </View>

            <View style={styles.heroCopy}>
              <Text style={styles.name} numberOfLines={1}>
                {user?.name || 'James Anderson'}
              </Text>
              <Text style={styles.role}>{roleLabel}</Text>

              <View style={styles.badgeRow}>
                {user?.isMember ? (
                  <View style={styles.memberPill}>
                    <Crown color={GOLD} size={11} />
                    <Text style={styles.memberText}>Gold Member</Text>
                  </View>
                ) : null}
                <View style={[styles.kycPill, { backgroundColor: kyc.bg, borderColor: kyc.border }]}>
                  {user?.kycStatus === 'approved' ? (
                    <CheckCircle2 color={kyc.color} size={11} />
                  ) : (
                    <Shield color={kyc.color} size={11} />
                  )}
                  <Text style={[styles.kycText, { color: kyc.color }]}>
                    {user?.kycStatus || 'approved'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {user?.isMember ? (
            <View style={styles.creditCard}>
              <Text style={styles.creditLabel}>Ride Credit</Text>
              <Text style={styles.creditValue}>${(user.rideCredit || 0).toFixed(2)}</Text>
            </View>
          ) : null}
        </AppCard>
      </MotiView>

      {/* Account details */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 240, delay: delays.content }}
      >
        <Text style={styles.sectionLabel}>Account Details</Text>
        <View style={styles.detailsCard}>
          <DetailRow
            icon={Building2}
            label="Hotel"
            value={user?.hotelName || 'The Grand Majestic Hotel'}
          />
          <DetailRow icon={Mail} label="Email" value={user?.email || 'james@grandhotel.com'} />
          <DetailRow icon={Phone} label="Phone" value={user?.phone || '+1 (555) 123-4567'} />
          <DetailRow
            icon={Smartphone}
            label="Device"
            value={user?.deviceName || 'Mobile Device'}
          />
          <DetailRow
            icon={Shield}
            label="KYC Status"
            value={user?.kycStatus || 'approved'}
            valueColor={kyc.color}
            isLast
          />
        </View>
      </MotiView>

      {/* Sign out */}
      <MotiView
        from={{ opacity: 0, translateY: 8 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 220, delay: delays.cta }}
        style={styles.ctaWrap}
      >
        <AppButton
          label="Sign Out"
          onPress={() => setUser(null)}
          variant="secondary"
          haptic="medium"
          style={styles.logoutBtn}
        />
      </MotiView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  heroCard: {
    padding: 14,
    marginBottom: 16,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarWrap: {
    position: 'relative',
    flexShrink: 0,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: GOLD_FAINT,
    borderWidth: 1,
    borderColor: GOLD_DIM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: GOLD,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 1,
  },
  crownBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  heroCopy: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: TYPE.name,
    color: '#fff',
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  role: {
    fontSize: TYPE.body,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  memberPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
    backgroundColor: GOLD_FAINT,
    borderWidth: 1,
    borderColor: GOLD_DIM,
  },
  memberText: {
    color: GOLD,
    fontSize: TYPE.small,
    fontWeight: '700',
  },
  kycPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
    borderWidth: 1,
  },
  kycText: {
    fontSize: TYPE.small,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  creditCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BORDER,
  },
  creditLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: TYPE.body,
    fontWeight: '500',
  },
  creditValue: {
    color: GREEN,
    fontSize: TYPE.title,
    fontWeight: '700',
  },

  sectionLabel: {
    fontSize: TYPE.small,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  detailsCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
    overflow: 'hidden',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 58,
  },
  detailIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: GOLD_FAINT,
    borderWidth: 1,
    borderColor: GOLD_DIM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailText: {
    flex: 1,
    minWidth: 0,
  },
  detailLabel: {
    fontSize: TYPE.small,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: '500',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: TYPE.body,
    color: '#fff',
    fontWeight: '600',
    lineHeight: 18,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: BORDER,
    marginLeft: 62,
  },

  ctaWrap: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BORDER,
  },
  logoutBtn: {
    width: '100%',
  },
});
