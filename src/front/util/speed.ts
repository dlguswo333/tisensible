import type {Position} from '@capacitor/geolocation';

export const calculateSpeedInUnit = (speed: number | null, unit: 'km/h'): number | null => {
  if (speed === null) {
    return null;
  }
  if (unit === 'km/h') {
    return (speed / 1000) * 3600;
  }
  return null;
};
