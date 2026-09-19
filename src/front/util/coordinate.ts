const EARTH_RADIUS = 6371000;

type Coord = {
  latitude: number;
  longitude: number;
};

const FULL_CIRCLE_DEGREES = 360;

const getHaversine = (radian: number) => {
  return Math.sin(radian / 2) ** 2;
};
const getRadianFromAngle = (angle: number) => {
  return (angle * Math.PI) / 180;
};
const getAngleFromRadian = (radian: number) => {
  return (radian * 180) / Math.PI;
};
export const getDistWithHaversine = (a: Coord, b: Coord): number => {
  const haversine =
    getHaversine(getRadianFromAngle(a.latitude - b.latitude)) +
    Math.cos(getRadianFromAngle(a.latitude)) *
      Math.cos(getRadianFromAngle(b.latitude)) *
      getHaversine(getRadianFromAngle(a.longitude - b.longitude));
  const radian = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  const dist = EARTH_RADIUS * radian;
  return dist;
};

const getLongitudeDiffSign = (from: Coord, to: Coord): number => {
  const diff = to.longitude - from.longitude;
  if (diff < -FULL_CIRCLE_DEGREES / 2) {
    return 1;
  }
  if (diff >= FULL_CIRCLE_DEGREES / 2) {
    return -1;
  }
  return Math.sign(diff);
};

/**
 * Get a direction in [0°, 360°), clockwise from true north, using the Earth coordinate system.
 * This approximates the direction using a flat right triangle, and its error increases as distance increases.
 */
export const getDirection = (from: Coord, to: Coord): number => {
  const latitudeDiff = {
    sign: Math.sign(to.latitude - from.latitude),
    dist: getDistWithHaversine({...to, longitude: from.longitude}, from),
  };
  const longitudeDiff = {
    sign: getLongitudeDiffSign(from, to),
    dist: getDistWithHaversine({...to, latitude: from.latitude}, from),
  };
  const direction = getAngleFromRadian(
    Math.atan2(longitudeDiff.sign * longitudeDiff.dist, latitudeDiff.sign * latitudeDiff.dist),
  );
  const normalizedDirection = (direction + FULL_CIRCLE_DEGREES) % FULL_CIRCLE_DEGREES;
  return normalizedDirection;
};
