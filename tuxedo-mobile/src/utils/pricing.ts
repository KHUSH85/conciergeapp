import { PaymentType } from '../types';

export const BASE_FARE = 45.00;
export const COMMISSION_RATE = 0.15;

export const calculateFare = (paymentType: PaymentType = 'card') => {
  if (paymentType === 'cash') return BASE_FARE * 1.2;
  return BASE_FARE;
};

export const calculateCommission = (fare: number) => fare * COMMISSION_RATE;

export const formatPrice = (price: number) => `${price.toFixed(2)}`;
