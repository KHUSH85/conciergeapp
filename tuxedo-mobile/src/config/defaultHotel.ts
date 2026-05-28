export const DEFAULT_US_HOTEL = 'The Plaza Hotel, 768 5th Ave, New York, NY 10019';

export function getHotelName(hotelName?: string | null): string {
  if (!hotelName || hotelName === 'The Grand Majestic Hotel') return DEFAULT_US_HOTEL;
  return hotelName;
}
