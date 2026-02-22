/** Convert m/s into a different unit. */
export const calculateSpeedInUnit = (speed: number | null, unit: 'km/h' | 'mi/h'): number | null => {
  if (speed === null) {
    return null;
  }
  if (unit === 'km/h') {
    return (speed / 1000) * 3600;
  }
  if (unit === 'mi/h') {
    return (speed / 1609.34) * 3600;
  }
  return null;
};

const EARTH_RADIUS = 6371000;

type Coord = {
  latitude: number;
  longitude: number;
};

const getHaversine = (radian: number) => {
  return Math.sin(radian / 2) ** 2;
};
const getRadianFromAngle = (angle: number) => {
  return (angle * Math.PI) / 180;
};
const getDistWithHaversine = (a: Coord, b: Coord): number => {
  const haversine =
    getHaversine(getRadianFromAngle(a.latitude - b.latitude)) +
    Math.cos(getRadianFromAngle(a.latitude)) *
      Math.cos(getRadianFromAngle(b.latitude)) *
      getHaversine(getRadianFromAngle(a.longitude - b.longitude));
  const radian = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  const dist = EARTH_RADIUS * radian;
  return dist;
};

export const getSpeedWithHaversine = (a: Coord, b: Coord, elapsedSec: number): number => {
  const dist = getDistWithHaversine(a, b);
  const speed = dist / elapsedSec;
  return speed;
};
