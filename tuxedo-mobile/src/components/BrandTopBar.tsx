import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { LOGO_SIZES, TuxedoLogo } from './TuxedoLogo';

const GOLD = '#D4AF37';
const SIDE = 44;
const PROFILE_PHOTO_SIZE = 36;
const CONCIERGE_PROFILE_PHOTO =
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400';

type Props = {
  onProfilePress?: () => void;
  showRightAction?: 'profile' | 'none';
};

/** Tab screens — large centered logo, profile on the right (no back on tab roots). */
export function BrandTopBar({ onProfilePress, showRightAction = 'profile' }: Props) {
  const navigation = useNavigation<any>();

  const openProfile = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onProfilePress) {
      onProfilePress();
      return;
    }
    const parent = navigation.getParent?.();
    if (parent?.navigate) {
      parent.navigate('ProfileTab', { screen: 'Profile' });
    } else {
      navigation.navigate('ProfileTab' as never);
    }
  };

  return (
    <View style={styles.row}>
      <View style={styles.side} />

      <View style={styles.center}>
        <TuxedoLogo variant="light" {...LOGO_SIZES.header} />
      </View>

      <View style={styles.side}>
        {showRightAction === 'profile' ? (
          <Pressable
            onPress={openProfile}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Open profile"
          >
            <Image source={{ uri: CONCIERGE_PROFILE_PHOTO }} style={styles.profilePhoto} />
          </Pressable>
        ) : (
          <View style={styles.sideSpacer} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    minHeight: 58,
  },
  side: {
    width: SIDE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideSpacer: {
    width: SIDE,
    height: SIDE,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  iconBtn: {
    width: SIDE,
    height: SIDE,
    borderRadius: SIDE / 2,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.35)',
    backgroundColor: 'rgba(212,175,55,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profilePhoto: {
    width: PROFILE_PHOTO_SIZE,
    height: PROFILE_PHOTO_SIZE,
    borderRadius: PROFILE_PHOTO_SIZE / 2,
  },
  iconBtnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
});
