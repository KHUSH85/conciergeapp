import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { User } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const GOLD = '#D4AF37';

type Props = {
  onProfilePress?: () => void;
  showRightAction?: 'profile' | 'none';
};

/** Centered Tuxedo brand row — same pattern as driver app home header. */
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
      <View style={styles.side}>
        <View style={styles.sideSpacer} />
      </View>

      <View style={styles.center}>
        <Text style={styles.brand}>Tuxedo</Text>
        <Text style={styles.brandTag}>Concierge App</Text>
      </View>

      <View style={styles.side}>
        {showRightAction === 'profile' ? (
          <Pressable
            onPress={openProfile}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Open profile"
          >
            <User color={GOLD} size={20} />
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
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  side: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideSpacer: {
    width: 44,
    height: 44,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  brand: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: -0.2,
  },
  brandTag: {
    marginTop: 3,
    color: GOLD,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.2,
    opacity: 0.85,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.22)',
    backgroundColor: 'rgba(212,175,55,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
});
