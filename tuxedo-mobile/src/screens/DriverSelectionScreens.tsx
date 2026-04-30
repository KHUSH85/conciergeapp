import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import {
  ArrowLeft, Zap, List, Heart, User, Shield, Star, MapPin, Clock,
  Info, Lock, Wallet, Car, Wifi, Music, Baby, Check, X, SlidersHorizontal,
} from 'lucide-react-native';
import { GlassCard } from '../components/GlassCard';
import { AppButton } from '../components/AppButton';
import { AppScreen } from '../components/AppScreen';
import { useHaptics } from '../hooks/useHaptics';
import { useStaggerAnimation } from '../hooks/useStaggerAnimation';
import { mockDrivers } from '../data/mockDrivers';
import { useApp } from '../context/AppContext';

const GOLD = '#D4AF37';

function trackRideReturnParams(paymentMethod: string | null | undefined, driver: (typeof mockDrivers)[number]) {
  return { fromMembershipPurchase: true, paymentMethod: paymentMethod ?? null, selectedDriver: driver };
}

// ─── Screen 1: Assignment Mode ────────────────────────────────────────────────
export const DriverAssignmentModeScreen = ({ navigation }: any) => {
  const { light } = useHaptics();
  const delays = useStaggerAnimation();

  const modes = [
    { id: 'auto',   title: 'Auto Match',       desc: 'System selects best available driver',              icon: Zap,  screen: 'DriverMatching' },
    { id: 'manual', title: 'Manual Selection', desc: 'Browse and choose from available drivers',          icon: List, screen: 'DriverList'     },
    { id: 'swipe',  title: 'Swipe Match',      desc: 'Luxury experience - swipe to find perfect match',  icon: Heart,screen: 'DriverSwipe'    },
  ];

  return (
    <AppScreen>
      <MotiView
        from={{ opacity: 0, translateY: -12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 240, delay: delays.header }}
      >
        <TouchableOpacity
          onPress={async () => { await light(); navigation.goBack(); }}
          style={styles.backBtn}
          accessibilityRole="button"
        >
          <ArrowLeft color={GOLD} size={18} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 16 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 260, delay: delays.content }}
      >
        <GlassCard style={styles.card}>
          <Text style={styles.title}>Select Driver Assignment Mode</Text>
          <Text style={styles.subtitle}>Choose how you'd like to assign a chauffeur</Text>
          {modes.map(({ id, title, desc, icon: Icon, screen }, i) => (
            <MotiView
              key={id}
              from={{ opacity: 0, translateX: -16 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: 'timing', duration: 220, delay: delays.item(i) }}
            >
              <TouchableOpacity
                onPress={async () => { await light(); navigation.navigate(screen); }}
                style={styles.modeBtn}
                accessibilityRole="button"
              >
                <View style={styles.modeIcon}><Icon color={GOLD} size={28} /></View>
                <View style={styles.modeInfo}>
                  <Text style={styles.modeTitle}>{title}</Text>
                  <Text style={styles.modeDesc}>{desc}</Text>
                </View>
                <ArrowLeft color={GOLD} size={20} style={{ transform: [{ rotate: '180deg' }] }} />
              </TouchableOpacity>
            </MotiView>
          ))}
        </GlassCard>
      </MotiView>
    </AppScreen>
  );
};

// ─── Screen 2: Driver List ────────────────────────────────────────────────────
export const DriverListScreen = ({ navigation, route }: any) => {
  const { user } = useApp();
  const { light, medium } = useHaptics();
  const delays = useStaggerAnimation();
  const fromTrackRide = route.params?.fromTrackRide === true;
  const paymentFlow = route.params?.paymentMethod ?? null;
  const membershipNav = fromTrackRide ? { fromTrackRide: true, paymentMethod: paymentFlow } : undefined;

  const isMember = user?.isMember === true;
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ hotelPreferred: false, verified: true, minRating: 4.5, maxDistance: 5 });

  const filtered = mockDrivers.filter(d => {
    if (filters.hotelPreferred && !d.hotelPreferred) return false;
    if (filters.verified && !d.verified) return false;
    if (d.rating < filters.minRating) return false;
    if (d.distance > filters.maxDistance) return false;
    return true;
  });

  return (
    <AppScreen>
      <MotiView
        from={{ opacity: 0, translateY: -12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 240, delay: delays.header }}
        style={styles.listHeader}
      >
        <TouchableOpacity
          onPress={async () => { await light(); navigation.goBack(); }}
          style={styles.backBtn}
          accessibilityRole="button"
        >
          <ArrowLeft color={GOLD} size={18} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.listHeaderRight}>
          {isMember && (
            <View style={styles.creditBadge}>
              <Wallet color={GOLD} size={14} />
              <Text style={styles.creditText}>Credit: ${(user?.rideCredit || 0).toFixed(2)}</Text>
            </View>
          )}
          <TouchableOpacity
            onPress={async () => {
              await light();
              isMember ? setShowFilters(!showFilters) : navigation.navigate('Wallet' as any, { screen: 'Membership', params: membershipNav });
            }}
            style={styles.filterBtn}
            accessibilityRole="button"
          >
            {isMember ? <SlidersHorizontal color={GOLD} size={18} /> : <Lock color={GOLD} size={16} />}
            <Text style={styles.filterText}>{isMember ? 'Filters' : 'Unlock Filters'}</Text>
          </TouchableOpacity>
        </View>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 16 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 260, delay: delays.content }}
      >
        <GlassCard style={styles.card}>
          <Text style={styles.titleItalic}>Available Chauffeurs</Text>
          {fromTrackRide && (
            <Text style={styles.trackRideHint}>Gold member — pick your chauffeur to continue to live tracking</Text>
          )}
          <Text style={styles.subtitle}>{filtered.length} driver{filtered.length !== 1 ? 's' : ''} found for your schedule</Text>

          {showFilters && isMember && (
            <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.filtersBox}>
              <Text style={styles.filterTitle}>Search Filters</Text>
              {[
                { key: 'hotelPreferred', label: 'Hotel Preferred Only' },
                { key: 'verified',       label: 'Verified Only'        },
              ].map(({ key, label }) => (
                <TouchableOpacity
                  key={key}
                  onPress={async () => { await light(); setFilters(f => ({ ...f, [key]: !f[key as 'hotelPreferred' | 'verified'] })); }}
                  style={styles.filterRow}
                  accessibilityRole="checkbox"
                >
                  <View style={[styles.checkbox, filters[key as 'hotelPreferred' | 'verified'] ? styles.checkboxActive : null]}>
                    {filters[key as 'hotelPreferred' | 'verified'] ? <Check color="#000" size={12} /> : null}
                  </View>
                  <Text style={styles.filterLabel}>{label}</Text>
                </TouchableOpacity>
              ))}
            </MotiView>
          )}

          {filtered.map((driver, i) => (
            <MotiView
              key={driver.id}
              from={{ opacity: 0, translateY: 16 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 220, delay: delays.item(i) }}
            >
              <View style={styles.driverCard}>
                <View style={styles.driverRow}>
                  <View style={styles.driverAvatarWrap}>
                    <View style={styles.driverAvatar}>
                      <User color="#4b5563" size={28} />
                    </View>
                    {driver.verified && <View style={styles.verifiedBadge}><Shield color="#000" size={10} /></View>}
                  </View>
                  <View style={styles.driverInfo}>
                    <View style={styles.driverNameRow}>
                      <Text style={styles.driverName}>{driver.name.split(' ')[0]} {driver.name.split(' ')[1]?.[0]}.</Text>
                      <View style={styles.ratingRow}>
                        <Star color={GOLD} size={14} fill={GOLD} />
                        <Text style={styles.ratingText}>{driver.rating}</Text>
                      </View>
                    </View>
                    <Text style={styles.driverCar}>{driver.vehicle.brand} {driver.vehicle.model}</Text>
                    <View style={styles.driverMeta}>
                      <View style={styles.metaItem}><MapPin color="#6b7280" size={11} /><Text style={styles.metaText}>{driver.distance} miles</Text></View>
                      <View style={styles.metaItem}><Clock color={GOLD} size={11} /><Text style={[styles.metaText, { color: GOLD }]}>{driver.eta} mins</Text></View>
                    </View>
                  </View>
                </View>
                <View style={styles.driverActions}>
                  <TouchableOpacity
                    onPress={async () => {
                      await light();
                      navigation.navigate('DriverProfile', fromTrackRide ? { driver, fromTrackRide: true, paymentMethod: paymentFlow } : { driver });
                    }}
                    style={styles.viewBtn}
                    accessibilityRole="button"
                  >
                    <Info color="#fff" size={14} />
                    <Text style={styles.viewBtnText}>View Profile</Text>
                  </TouchableOpacity>
                  <AppButton
                    label="Select Chauffeur"
                    onPress={() =>
                      fromTrackRide
                        ? navigation.navigate('TrackRide', trackRideReturnParams(paymentFlow, driver))
                        : navigation.navigate('DriverConfirmation', { driver })
                    }
                    haptic="medium"
                    style={styles.selectBtn}
                    labelStyle={styles.selectBtnLabel}
                  />
                </View>
              </View>
            </MotiView>
          ))}
        </GlassCard>
      </MotiView>
    </AppScreen>
  );
};

// ─── Screen 3: Driver Profile ─────────────────────────────────────────────────
export const DriverProfileScreen = ({ navigation, route }: any) => {
  const { user } = useApp();
  const { light, medium } = useHaptics();
  const delays = useStaggerAnimation();
  const isMember = user?.isMember === true;
  const driver = route.params?.driver || mockDrivers[0];
  const fromTrackRide = route.params?.fromTrackRide === true;
  const paymentFlow = route.params?.paymentMethod ?? null;
  const membershipNav = fromTrackRide ? { fromTrackRide: true, paymentMethod: paymentFlow } : undefined;

  return (
    <AppScreen>
      <MotiView
        from={{ opacity: 0, translateY: -12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 240, delay: delays.header }}
        style={styles.listHeader}
      >
        <TouchableOpacity
          onPress={async () => { await light(); navigation.goBack(); }}
          style={styles.backBtn}
          accessibilityRole="button"
        >
          <ArrowLeft color={GOLD} size={18} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        {isMember && (
          <View style={styles.creditBadge}>
            <Wallet color={GOLD} size={14} />
            <Text style={styles.creditText}>${(user?.rideCredit || 0).toFixed(2)} Credit</Text>
          </View>
        )}
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 16 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 260, delay: delays.content }}
      >
        <GlassCard style={styles.card}>
          <View style={styles.profileHeader}>
            <View style={styles.profileAvatarWrap}>
              <View style={styles.profileAvatar}>
                <Text style={styles.profileInitial}>{driver.name.charAt(0)}</Text>
              </View>
              {driver.verified && <View style={styles.profileVerified}><Shield color="#000" size={16} /></View>}
            </View>
            <Text style={styles.profileName}>{driver.name.split(' ')[0]} {driver.name.split(' ')[1]?.[0]}.</Text>
            <View style={styles.profileStats}>
              <View style={styles.profileStat}>
                <Text style={styles.profileStatVal}>{driver.rating}</Text>
                <Text style={styles.profileStatLabel}>Rating</Text>
              </View>
              <View style={styles.profileStatDivider} />
              <View style={styles.profileStat}>
                <Text style={styles.profileStatVal}>{driver.experience}</Text>
                <Text style={styles.profileStatLabel}>Years Exp</Text>
              </View>
            </View>
          </View>

          <View style={styles.vehicleBox}>
            <View style={styles.vehicleHeader}><Car color={GOLD} size={16} /><Text style={styles.vehicleTitle}>Vehicle Details</Text></View>
            <View style={styles.vehicleGrid}>
              {[
                { label: 'Make/Model', value: `${driver.vehicle.brand} ${driver.vehicle.model}` },
                { label: 'Plate',      value: driver.vehicle.plate                              },
                { label: 'Year',       value: String(driver.vehicle.year)                       },
                { label: 'Interior',   value: driver.vehicle.interior                           },
              ].map(({ label, value }) => (
                <View key={label} style={styles.vehicleItem}>
                  <Text style={styles.vehicleItemLabel}>{label}</Text>
                  <Text style={styles.vehicleItemValue}>{value}</Text>
                </View>
              ))}
            </View>
          </View>

          {isMember ? (
            <View style={styles.amenitiesBox}>
              <Text style={styles.amenitiesTitle}>Premium Amenities</Text>
              <View style={styles.amenitiesGrid}>
                {driver.amenities.wifi      && <View style={styles.amenityChip}><Wifi   color={GOLD} size={14} /><Text style={styles.amenityText}>WiFi</Text></View>}
                {driver.amenities.music     && <View style={styles.amenityChip}><Music  color={GOLD} size={14} /><Text style={styles.amenityText}>Audio</Text></View>}
                {driver.amenities.childSeat && <View style={styles.amenityChip}><Baby   color={GOLD} size={14} /><Text style={styles.amenityText}>Child Seat</Text></View>}
              </View>
            </View>
          ) : (
            <TouchableOpacity
              onPress={async () => { await light(); navigation.navigate('Wallet' as any, { screen: 'Membership', params: membershipNav }); }}
              style={styles.lockedBox}
              accessibilityRole="button"
            >
              <Lock color={GOLD} size={28} />
              <Text style={styles.lockedTitle}>Premium Amenities Locked</Text>
              <Text style={styles.lockedLink}>Join Membership to View</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.bioQuote}>
            "Professional chauffeur providing a seamless luxury experience. Certified for executive protection and concierge-level service."
          </Text>
        </GlassCard>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 240, delay: delays.cta }}
        style={styles.ctaWrap}
      >
        <AppButton
          label="Assign This Chauffeur"
          onPress={() =>
            fromTrackRide
              ? navigation.navigate('TrackRide', trackRideReturnParams(paymentFlow, driver))
              : navigation.navigate('DriverConfirmation', { driver })
          }
          haptic="medium"
          style={styles.assignBtn}
        />
      </MotiView>
    </AppScreen>
  );
};

// ─── Screen 4: Swipe Match ────────────────────────────────────────────────────
export const DriverSwipeScreen = ({ navigation }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { light, medium } = useHaptics();
  const delays = useStaggerAnimation();
  const driver = mockDrivers[currentIndex];

  const handlePass = async () => {
    await light();
    if (currentIndex < mockDrivers.length - 1) setCurrentIndex(i => i + 1);
    else navigation.navigate('DriverAssignmentMode');
  };

  if (currentIndex >= mockDrivers.length) {
    return (
      <AppScreen centerContent>
        <GlassCard style={[styles.card, { alignItems: 'center', padding: 40 }]}>
          <Car color="#374151" size={64} style={{ marginBottom: 16 }} />
          <Text style={styles.title}>Queue Empty</Text>
          <Text style={styles.subtitle}>No more available chauffeurs in your area.</Text>
          <AppButton
            label="Back to Menu"
            onPress={() => navigation.navigate('DriverAssignmentMode')}
            style={styles.assignBtn}
          />
        </GlassCard>
      </AppScreen>
    );
  }

  return (
    <AppScreen centerContent>
      <MotiView
        from={{ opacity: 0, translateY: -12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 240, delay: delays.header }}
      >
        <TouchableOpacity
          onPress={async () => { await light(); navigation.goBack(); }}
          style={[styles.backBtn, { marginBottom: 20 }]}
          accessibilityRole="button"
        >
          <ArrowLeft color={GOLD} size={18} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </MotiView>

      <MotiView
        from={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: 260, delay: delays.content }}
      >
        <GlassCard style={[styles.card, { padding: 28 }]}>
          <View style={styles.swipeAvatarWrap}>
            <Text style={styles.swipeInitial}>{driver.name.charAt(0)}</Text>
          </View>
          <Text style={styles.swipeName}>{driver.name.split(' ')[0]} {driver.name.split(' ')[1]?.[0]}.</Text>
          <View style={styles.ratingRow}><Star color={GOLD} size={16} fill={GOLD} /><Text style={[styles.ratingText, { fontSize: 16 }]}>{driver.rating}</Text></View>
          <Text style={styles.swipeCar}>{driver.vehicle.brand} {driver.vehicle.model}</Text>
          <View style={styles.swipeMeta}>
            <Text style={styles.swipeMetaText}>{driver.distance} mi away  {driver.eta} min ETA</Text>
          </View>
        </GlassCard>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 240, delay: delays.cta }}
        style={styles.swipeActions}
      >
        <TouchableOpacity onPress={handlePass} style={styles.swipePassBtn} accessibilityRole="button" accessibilityLabel="Pass">
          <X color="#ef4444" size={28} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => { await light(); navigation.navigate('DriverProfile', { driver }); }}
          style={styles.swipeInfoBtn}
          accessibilityRole="button"
          accessibilityLabel="View profile"
        >
          <Info color={GOLD} size={24} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => { await medium(); navigation.navigate('DriverConfirmation', { driver }); }}
          style={styles.swipeSelectBtn}
          accessibilityRole="button"
          accessibilityLabel="Select driver"
        >
          <Check color="#000" size={28} />
        </TouchableOpacity>
      </MotiView>
    </AppScreen>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16, minHeight: 44 },
  backText: { color: GOLD, fontWeight: '700', fontSize: 14 },
  card: { padding: 20 },
  title: { fontSize: 22, color: '#fff', fontWeight: '800', marginBottom: 6 },
  titleItalic: { fontSize: 22, color: '#fff', fontWeight: '800', marginBottom: 6, fontStyle: 'italic', textTransform: 'uppercase' },
  trackRideHint: { color: GOLD, fontSize: 12, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  subtitle: { fontSize: 14, color: '#9ca3af', fontWeight: '500', marginBottom: 20 },
  bioQuote: { color: '#9ca3af', fontSize: 12, fontStyle: 'italic', lineHeight: 18, marginBottom: 16 },
  modeBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)', borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.25)', borderRadius: 14, padding: 18, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 2,
    minHeight: 72,
  },
  modeIcon: {
    padding: 12, borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.4)', borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.25)', marginRight: 14,
  },
  modeInfo: { flex: 1 },
  modeTitle: { color: '#fff', fontWeight: '700', fontSize: 16, marginBottom: 2 },
  modeDesc: { color: '#9ca3af', fontSize: 13, fontWeight: '500' },
  listHeader: { marginBottom: 16 },
  listHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  creditBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 6,
    backgroundColor: 'rgba(212,175,55,0.08)', borderRadius: 50,
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)',
  },
  creditText: { color: '#fff', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  filterBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.6)', borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)', borderRadius: 10, minHeight: 44,
  },
  filterText: { color: GOLD, fontWeight: '700', fontSize: 13 },
  filtersBox: {
    backgroundColor: 'rgba(0,0,0,0.6)', borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.2)', borderRadius: 12, padding: 14, marginBottom: 16,
  },
  filterTitle: { color: '#fff', fontWeight: '700', fontSize: 14, marginBottom: 10 },
  filterRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8, minHeight: 44 },
  checkbox: {
    width: 22, height: 22, borderRadius: 4,
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.4)',
    justifyContent: 'center', alignItems: 'center',
  },
  checkboxActive: { backgroundColor: GOLD, borderColor: GOLD },
  filterLabel: { color: '#fff', fontSize: 13, fontWeight: '500' },
  driverCard: {
    backgroundColor: 'rgba(0,0,0,0.4)', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 2,
  },
  driverRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  driverAvatarWrap: { position: 'relative', marginRight: 14 },
  driverAvatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#1f2937', borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.25)', justifyContent: 'center', alignItems: 'center',
  },
  verifiedBadge: {
    position: 'absolute', bottom: -2, right: -2,
    backgroundColor: GOLD, borderRadius: 10, padding: 3, borderWidth: 2, borderColor: '#000',
  },
  driverInfo: { flex: 1 },
  driverNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  driverName: { color: '#fff', fontWeight: '700', fontSize: 16 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { color: GOLD, fontWeight: '700', fontSize: 13 },
  driverCar: { color: '#9ca3af', fontSize: 13, fontWeight: '500', marginBottom: 6 },
  driverMeta: { flexDirection: 'row', gap: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: '#6b7280', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  driverActions: { flexDirection: 'row', gap: 10 },
  viewBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 12, backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 10, minHeight: 44,
  },
  viewBtnText: { color: '#fff', fontWeight: '700', fontSize: 11, textTransform: 'uppercase' },
  selectBtn: { flex: 1, paddingVertical: 12 },
  selectBtnLabel: { fontSize: 11, textTransform: 'uppercase' },
  profileHeader: { alignItems: 'center', marginBottom: 24 },
  profileAvatarWrap: { position: 'relative', marginBottom: 12 },
  profileAvatar: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: 'rgba(212,175,55,0.12)', borderWidth: 2,
    borderColor: 'rgba(212,175,55,0.4)', justifyContent: 'center', alignItems: 'center',
    shadowColor: GOLD, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 3,
  },
  profileInitial: { fontSize: 48, color: GOLD, fontWeight: '900' },
  profileVerified: {
    position: 'absolute', bottom: 0, right: 0,
    width: 36, height: 36, backgroundColor: GOLD, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#000',
  },
  profileName: { fontSize: 26, color: '#fff', fontWeight: '900', marginBottom: 12 },
  profileStats: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  profileStat: { alignItems: 'center' },
  profileStatVal: { fontSize: 22, color: GOLD, fontWeight: '900' },
  profileStatLabel: { fontSize: 10, color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' },
  profileStatDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.1)' },
  vehicleBox: {
    backgroundColor: 'rgba(0,0,0,0.4)', borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.2)', borderRadius: 16, padding: 18, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 2,
  },
  vehicleHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  vehicleTitle: { color: '#fff', fontWeight: '700', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  vehicleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  vehicleItem: { width: '45%' },
  vehicleItemLabel: { color: '#6b7280', fontSize: 10, fontWeight: '600', textTransform: 'uppercase', marginBottom: 2 },
  vehicleItemValue: { color: '#fff', fontWeight: '700', fontSize: 13 },
  amenitiesBox: {
    backgroundColor: 'rgba(0,0,0,0.4)', borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.2)', borderRadius: 16, padding: 18, marginBottom: 16,
  },
  amenitiesTitle: { color: '#fff', fontWeight: '700', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  amenityChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(212,175,55,0.08)', borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.2)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6,
  },
  amenityText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  lockedBox: {
    backgroundColor: 'rgba(212,175,55,0.05)', borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)', borderRadius: 16, padding: 24,
    alignItems: 'center', marginBottom: 16, borderStyle: 'dashed', minHeight: 100,
  },
  lockedTitle: { color: '#fff', fontWeight: '900', fontSize: 12, textTransform: 'uppercase', marginTop: 8, marginBottom: 4 },
  lockedLink: { color: GOLD, fontSize: 11, fontWeight: '900', textTransform: 'uppercase', textDecorationLine: 'underline' },
  ctaWrap: { marginTop: 20 },
  assignBtn: { width: '100%' },
  swipeAvatarWrap: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(212,175,55,0.12)', borderWidth: 2,
    borderColor: 'rgba(212,175,55,0.4)', justifyContent: 'center', alignItems: 'center',
    alignSelf: 'center', marginBottom: 16,
    shadowColor: GOLD, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 3,
  },
  swipeInitial: { fontSize: 52, color: GOLD, fontWeight: '900' },
  swipeName: { fontSize: 26, color: '#fff', fontWeight: '900', textAlign: 'center', marginBottom: 8 },
  swipeCar: { color: '#9ca3af', fontSize: 15, textAlign: 'center', fontWeight: '500', marginTop: 6 },
  swipeMeta: { marginTop: 8, alignItems: 'center' },
  swipeMetaText: { color: '#6b7280', fontSize: 12, fontWeight: '500' },
  swipeActions: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20, marginTop: 24 },
  swipePassBtn: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#000', borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.4)', justifyContent: 'center', alignItems: 'center',
  },
  swipeInfoBtn: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#000', borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.4)', justifyContent: 'center', alignItems: 'center',
  },
  swipeSelectBtn: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: GOLD,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: GOLD, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
});
