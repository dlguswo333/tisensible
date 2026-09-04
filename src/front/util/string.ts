import dayjs from 'dayjs';
import i18n from 'i18next';

/**
 * Get 'N', 'NW' like azimuth strings from rotate (0<=rotate<360).
 * Provides 8 distinct values.
 */
export const getAzimuthString = (rotate: number) => {
  const azimuths = ['N', 'NW', 'W', 'SW', 'S', 'SE', 'E', 'NE'];
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
    return i18n.t('date.now');
  }
  if (diffSecond <= 120) {
    return i18n.t('date.nSecondsAgo', {n: diffSecond});
  }
  if (diffSecond <= 240) {
    const diffMinute = Math.floor(diffSecond / 60);
    return i18n.t('date.nMinutesAgo', {n: diffMinute});
  }
  return i18n.t('date.whilAgo');
};

export const addSuffix = (str: string | number | null | undefined, suffix: string) => {
  if (str === null || str === undefined) {
    return str;
  }
  return `${str}${suffix}`;
};

export const roundFractionDigits = (number: number | null | undefined, targetDigitsLen: number) => {
  if (number === null || number === undefined) {
    return number;
  }
  const numberStr = number.toString();
  const isExponential = /e/i.test(numberStr);
  if (isExponential) {
    return numberStr;
  }
  const fractionStrLen = (numberStr.split('.')[1] ?? '').length;
  if (fractionStrLen <= targetDigitsLen) {
    return number.toString();
  }
  return number.toFixed(targetDigitsLen);
};
