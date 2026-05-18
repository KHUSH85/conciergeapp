import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { User, Crown, Shield, Smartphone, Mail, Phone, Building2 } from 'lucide-react-native';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { AppScreen } from '../components/AppScreen';
import { useStaggerAnimation } from '../hooks/useStaggerAnimation';
import { useApp } from '../context/AppContext';

const GOLD       = '#D4AF37';
const GOLD_FAINT = 'rgba(212,175,55,0.08)';
const GOLD_DIM   = 'rgba(212,175,55,0.25)';

export const ProfileScreen = ({ navigation }: any) => {
  const { user, setUser } = useApp();
  const delays = useStaggerAnimation();

  const fields = [
    { icon: Building2,  label: 'Hotel',      value: user?.hotelName  || 'The Grand Majestic Hotel' },
    { icon: Mail,       label: 'Email',       value: user?.email      || 'james@grandhotel.com'     },
    { icon: Phone,      label: 'Phone',       value: user?.phone      || '+1 (555) 123-4567'        },
    { icon: Smartphone, label: 'Device',      value: user?.deviceName || 'Mobile Device'            },
    { icon: Shield,     label: 'KYC Status',  value: user?.kycStatus  || 'approved'                 },
  ];

  const kycColor = user?.kycStatus === 'approved' ? '#22c55e'
    : user?.kycStatus === 'rejected' ? '#f87171'
    : '#f59e0b';

  return (
    <AppScreen brandHeader brandShowProfile={false}>
      {/* ── Avatar + name ── */}
      <MotiView
        from={{ opacity: 0, translateY: 16 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 260, delay: delays.header }}
      >
        <AppCard variant="gold" style={styles.heroCard}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <User color={GOLD} size={40} />
            </View>
            {user?.isMember && (
              <View style={styles.crownBadge}>
                <Crown color="#000" size={12} />
              </View>
            )}
          </View>

          <Text style={styles.name}>{user?.name || 'James Anderson'}</Text>
          <Text style={styles.role}>
            {user?.role
              ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
              : 'Concierge'}
          </Text>

          {user?.isMember && (
            <View style={styles.memberBadge}>
              <Crown color={GOLD} size={12} />
              <Text style={styles.memberText}>Gold Member</Text>
            </View>
          )}

          {user?.isMember && (
            <View style={styles.creditRow}>
              <Text style={styles.creditLabel}>Ride Credit</Text>
              <Text style={styles.creditValue}>${(user.rideCredit || 0).toFixed(2)}</Text>
            </View>
          )}
        </AppCard>
      </MotiView>

      {/* ── Info fields ── */}
      <Text style={styles.sectionLabel}>Account Details</Text>
      <MotiView
        from={{ opacity: 0, translateY: 12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 240, delay: delays.content }}
      >
        <AppCard>
          {fields.map(({ icon: Icon, label, value }, i) => (
            <React.Fragment key={label}>
              <View style={styles.fieldRow}>
                <View style={styles.fieldIcon}>
                  <Icon
                    color={label === 'KYC Status' ? kycColor : '#6b7280'}
                    size={16}
                  />
                </View>
                <View style={styles.fieldText}>
                  <Text style={styles.fieldLabel}>{label}</Text>
                  <Text style={[
                    styles.fieldValue,
                    label === 'KYC Status' && { color: kycColor },
                  ]}>
                    {value}
                  </Text>
                </View>
              </View>
              {i < fields.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </AppCard>
      </MotiView>

      {/* ── Logout ── */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
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
  heroCard: { padding: 24, alignItems: 'center', marginBottom: 20 },
  avatarWrap: { position: 'relative', marginBottom: 14 },
  avatar: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: GOLD_FAINT,
    borderWidth: 1, borderColor: GOLD_DIM,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  crownBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: GOLD,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#000',
  },
  name: { fontSize: 22, color: '#fff', fontWeight: '800', marginBottom: 4 },
  role: { fontSize: 13, color: '#9ca3af', fontWeight: '500', marginBottom: 12 },
  memberBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: GOLD_FAINT,
    borderWidth: 1, borderColor: GOLD_DIM,
    borderRadius: 50, paddingHorizontal: 12, paddingVertical: 5,
    marginBottom: 16,
  },
  memberText: { color: GOLD, fontSize: 11, fontWeight: '700' },
  creditRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(34,197,94,0.08)',
    borderWidth: 1, borderColor: 'rgba(34,197,94,0.2)',
    borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10,
  },
  creditLabel: { color: '#9ca3af', fontSize: 13, fontWeight: '500' },
  creditValue: { color: '#22c55e', fontSize: 18, fontWeight: '800' },
  sectionLabel: {
    fontSize: 11, color: '#6b7280', fontWeight: '600',
    letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10,
  },
  fieldRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 14, paddingHorizontal: 16, paddingVertical: 14, minHeight: 56,
  },
  fieldIcon: {
    width: 34, height: 34, borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center', justifyContent: 'center',
  },
  fieldText: { flex: 1 },
  fieldLabel: { fontSize: 11, color: '#6b7280', fontWeight: '500', marginBottom: 2 },
  fieldValue: { fontSize: 14, color: '#fff', fontWeight: '600' },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginLeft: 64,
  },
  ctaWrap: { marginTop: 20 },
  logoutBtn: { width: '100%' },
});
