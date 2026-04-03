import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../types';

const KEY_MEMBER = 'isMember';
const KEY_CREDIT = 'rideCredit';
const KEY_PENDING_COUPON = 'pendingAppDownloadCoupon';

export async function loadMembershipState(): Promise<{ isMember: boolean; rideCredit: number }> {
  const [[, m], [, rc]] = await AsyncStorage.multiGet([KEY_MEMBER, KEY_CREDIT]);
  const isMember = m === 'true';
  const raw = rc != null ? parseFloat(rc) : 0;
  const rideCredit = Number.isFinite(raw) ? raw : 0;
  return { isMember, rideCredit };
}

export async function persistMembershipState(isMember: boolean, rideCredit: number): Promise<void> {
  if (isMember) {
    await AsyncStorage.multiSet([
      [KEY_MEMBER, 'true'],
      [KEY_CREDIT, String(rideCredit)],
    ]);
  }
}

function generateCouponCode(): string {
  const token = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `TUX100-${token}`;
}

export async function storePendingAppDownloadCoupon(user: User | null): Promise<void> {
  const couponData = {
    code: generateCouponCode(),
    amount: 100,
    campaign: 'track-ride-download-popup',
    linkedIdentity: {
      phone: user?.phone ?? null,
      email: user?.email ?? null,
    },
    status: 'pending_app_login',
    issuedAt: new Date().toISOString(),
  };
  await AsyncStorage.setItem(KEY_PENDING_COUPON, JSON.stringify(couponData));
}
