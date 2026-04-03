import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Car } from 'lucide-react-native';
import { GlassCard } from '../components/GlassCard';
import { ScreenShell } from '../components/ScreenShell';

const GOLD = '#D4AF37';

export const DriverMatchingScreen = ({ navigation }: any) => {
  useEffect(() => {
    const timer = setTimeout(() => navigation.navigate('DriverETA'), 4000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ScreenShell centerContent>
      <GlassCard style={styles.card}>
        <View style={styles.iconWrap}>
          <MotiView
            from={{ opacity: 0.2, scale: 0.8 }}
            animate={{ opacity: 0.4, scale: 1.4 }}
            transition={{ type: 'timing', duration: 2000, loop: true }}
            style={styles.glow}
          />
          <MotiView from={{ scale: 1 }} animate={{ scale: 1.05 }} transition={{ type: 'timing', duration: 2000, loop: true }}>
            <Car color={GOLD} size={72} />
          </MotiView>
        </View>

        <Text style={styles.title}>Finding Your Chauffeur</Text>
        <Text style={styles.subtitle}>Connecting you with the closest available premium vehicle...</Text>

        <MotiView
          from={{ rotate: '0deg' }} animate={{ rotate: '360deg' }}
          transition={{ type: 'timing', duration: 1200, loop: true }}
          style={styles.spinner}
        />

        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Cancel Request</Text>
        </TouchableOpacity>
      </GlassCard>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  card: { padding: 40, alignItems: 'center', width: '100%', maxWidth: 420, alignSelf: 'center' },
  iconWrap: { alignItems: 'center', justifyContent: 'center', marginBottom: 24, width: 100, height: 100 },
  glow: { position: 'absolute', width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(212,175,55,0.2)' },
  title: { fontSize: 22, color: '#fff', fontWeight: '900', textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 14, color: '#9ca3af', textAlign: 'center', fontWeight: '500', marginBottom: 32, lineHeight: 22 },
  spinner: { width: 40, height: 40, borderRadius: 20, borderWidth: 3, borderColor: GOLD, borderTopColor: 'transparent', marginBottom: 32 },
  cancelBtn: { paddingVertical: 8 },
  cancelText: { color: '#6b7280', fontWeight: '700', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
});
