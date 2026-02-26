import dayjs from 'dayjs';

/**
 * Get 'N', 'NW' like azimuth strings from rotate (0<=rotate<360).
 * Provides 8 distinct values.
 */
export const getAzimuthString = (rotate: number) => {
  const azimuths = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const ind = Math.floor(((rotate + 22.5) / 45) % 8);
  return azimuths[ind];
};

export const getLatitudeSuffix = (latitude: number) => {
  return latitude > 0 ? '°N' : '°S';
};

export const getLongitudeSuffix = (longitude: number) => {
  return longitude > 0 ? '°E' : '°W';
};

export const getRelativeTime = (date: Date, baseDate: Date) => {
  const diffSecond = dayjs(baseDate).diff(dayjs(date), 'second');
  if (diffSecond <= 3) {
    return 'Now';
  }
  if (diffSecond <= 120) {
    return `${diffSecond} seconds ago`;
  }
  if (diffSecond <= 240) {
    const diffMinute = Math.floor(diffSecond / 60);
    return `${diffMinute} minutes ago`;
  }
  return 'A while ago';
};

export const addSuffix = (str: string | number | null | undefined, suffix: string) => {
  if (str === null || str === undefined) {
    return str;
  }
  return `${str}${suffix}`;
};
