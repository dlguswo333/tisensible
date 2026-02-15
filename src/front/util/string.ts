/**
 * Get 'N', 'NW' like azimuth strings from rotate (0<=rotate<360).
 * Provides 8 distinct values.
 */
export const getAzimuthString = (rotate: number) => {
  const azimuths = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const ind = Math.floor(((rotate + 22.5) / 45) % 8);
  return azimuths[ind];
};
