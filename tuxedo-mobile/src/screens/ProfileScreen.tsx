import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { User, ArrowLeft } from 'lucide-react-native';
import { GlassCard, GoldButton } from '../components/GlassCard';
import { ScreenShell } from '../components/ScreenShell';
import { useApp } from '../context/AppContext';

const GOLD = '#D4AF37';

export const ProfileScreen = ({ navigation }: any) => {
  const { user, setUser } = useApp();

  const fields = [
    { label: 'Hotel', value: user?.hotelName || 'The Grand Majestic Hotel' },
    { label: 'Email', value: user?.email || 'james@grandhotel.com' },
    { label: 'Phone', value: user?.phone || '+1 (555) 123-4567' },
    { label: 'Device', value: user?.deviceName || 'Mobile Device' },
    { label: 'KYC Status', value: user?.kycStatus || 'approved' },
    { label: 'Membership', value: user?.isMember ? 'Gold Member' : 'Standard' },
  ];

  return (
    <ScreenShell>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <ArrowLeft color={GOLD} size={18} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <GlassCard style={styles.card}>
        {/* Avatar */}
        <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 500 }} style={styles.avatarSection}>
          <View style={styles.avatar}>
            <User color={GOLD} size={44} />
          </View>
          <Text style={styles.name}>{user?.name || 'James Anderson'}</Text>
          <Text style={styles.role}>{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Concierge'}</Text>
          {user?.isMember && (
            <View style={styles.memberBadge}>
              <Text style={styles.memberText}>Gold Member</Text>
            </View>
          )}
        </MotiView>

        {/* Fields */}
        <View style={styles.fieldsList}>
          {fields.map(({ label, value }, i) => (
            <MotiView key={label} from={{ opacity: 0, translateX: -20 }} animate={{ opacity: 1, translateX: 0 }} transition={{ type: 'timing', duration: 300, delay: 200 + i * 80 }}>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>{label}</Text>
                <Text style={styles.fieldValue}>{value}</Text>
              </View>
            </MotiView>
          ))}
        </View>

        {/* Ride Credit if member */}
        {user?.isMember && (
          <View style={styles.creditBox}>
            <Text style={styles.creditLabel}>Ride Credit Balance</Text>
            <Text style={styles.creditValue}>${(user.rideCredit || 0).toFixed(2)}</Text>
          </View>
        )}

        <GoldButton
          variant="secondary"
          onPress={() => { setUser(null); navigation.replace('Login'); }}
          style={styles.logoutBtn}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </GoldButton>
      </GlassCard>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  backText: { color: GOLD, fontWeight: '700', fontSize: 14 },
  card: { padding: 24 },
  avatarSection: { alignItems: 'center', marginBottom: 28 },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(212,175,55,0.15)', borderWidth: 2, borderColor: 'rgba(212,175,55,0.4)', justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  name: { fontSize: 24, color: '#fff', fontWeight: '900', marginBottom: 4 },
  role: { fontSize: 15, color: GOLD, fontWeight: '700' },
  memberBadge: { marginTop: 8, paddingHorizontal: 14, paddingVertical: 4, backgroundColor: 'rgba(212,175,55,0.15)', borderRadius: 50, borderWidth: 1, borderColor: 'rgba(212,175,55,0.4)' },
  memberText: { color: GOLD, fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  fieldsList: { gap: 10, marginBottom: 20 },
  fieldRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', borderWidth: 2, borderColor: 'rgba(212,175,55,0.2)', borderRadius: 12, padding: 14 },
  fieldLabel: { color: '#9ca3af', fontSize: 13, fontWeight: '500' },
  fieldValue: { color: '#fff', fontWeight: '700', fontSize: 13 },
  creditBox: { backgroundColor: 'rgba(212,175,55,0.1)', borderWidth: 2, borderColor: 'rgba(212,175,55,0.3)', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 20 },
  creditLabel: { color: '#9ca3af', fontSize: 12, fontWeight: '500', marginBottom: 4 },
  creditValue: { color: GOLD, fontSize: 28, fontWeight: '900' },
  logoutBtn: { width: '100%', paddingVertical: 16 },
  logoutText: { color: GOLD, fontWeight: '900', fontSize: 15, textAlign: 'center' },
});
