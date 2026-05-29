declare const process: {
  env?: Record<string, string | undefined>;
};

const DEFAULT_SMS_API_BASE_URL = 'http://localhost:4000';

export const SMS_API_BASE_URL =
  process.env?.EXPO_PUBLIC_SMS_API_BASE_URL?.replace(/\/$/, '') ?? DEFAULT_SMS_API_BASE_URL;

type SmsResponse = {
  ok: boolean;
  message?: string;
  [key: string]: unknown;
};

type TrackingSmsPayload = {
  phone: string;
  guestName?: string;
  rideId: string;
  trackingUrl: string;
  pickup?: string;
  dropoff?: string;
};

async function postSms<T extends SmsResponse>(path: string, body: unknown): Promise<T> {
  const url = `${SMS_API_BASE_URL}${path}`;
  const startedAt = Date.now();

  console.log('[SMS_API_REQUEST]', { url, body });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = (await response.json().catch(() => ({}))) as T;

    console.log('[SMS_API_RESPONSE]', {
      url,
      status: response.status,
      durationMs: Date.now() - startedAt,
      data,
    });

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || 'SMS request failed. Please try again.');
    }

    return data;
  } catch (error) {
    console.log('[SMS_API_ERROR]', {
      url,
      durationMs: Date.now() - startedAt,
      message: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

export function toE164Phone(input: string, defaultDialCode?: string): string {
  const trimmed = input.trim();
  const digits = trimmed.replace(/\D/g, '');

  if (trimmed.startsWith('+')) return `+${digits}`;
  if (defaultDialCode) return `${defaultDialCode}${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  return `+${digits}`;
}

export function sendOtp(phone: string) {
  return postSms('/api/sms/otp/send', { phone });
}

export function verifyOtp(phone: string, code: string) {
  return postSms('/api/sms/otp/verify', { phone, code });
}

export function sendTrackingSms(payload: TrackingSmsPayload) {
  return postSms('/api/sms/tracking-link', payload);
}

export function sendMembershipSms(payload: {
  phone: string;
  guestName?: string;
  membershipUrl: string;
}) {
  return postSms('/api/sms/membership-link', payload);
}
