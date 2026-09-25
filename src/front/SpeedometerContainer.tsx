import {useRef} from 'react';
import {useTranslation} from 'react-i18next';
import Speedometer from './Speedometer';
import useCurrentDate from './useCurrentDate';
import useDownsizeSpeedometer from './useDownsizeSpeedometer';
import useSpeedometerSensor from './useSpeedometerSensor';
import useSpeedUnit from './useSpeedUnit';
import {calculateSpeedInUnit} from './util/speed';
import {
  addSuffix,
  getAzimuthString,
  getLatitudeSuffix,
  getLongitudeSuffix,
  getRelativeTime,
  roundFractionDigits,
} from './util/string';

const WARNING_LEVELS = {
  ACCURACY: {
    LOW: 10,
    HIGH: 30,
  },
  ALTITUDE_ACCURACY: {
    LOW: 20,
    HIGH: 40,
  },
} as const;
const getWarningLevel = (value: number, info: keyof typeof WARNING_LEVELS) => {
  return value >= WARNING_LEVELS[info].HIGH ? 'HIGH' : value >= WARNING_LEVELS[info].LOW ? 'LOW' : null;
};

type ButtonProps = {
  onClick: () => unknown;
};

const StopButton = ({onClick}: ButtonProps) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className='p-3 w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 border border-gray-500 shadow-gray-500 shadow-xs active:scale-110 active:bg-sky-300/50 transition'
    >
      <svg className='w-full h-full fill-white stroke-1 stroke-black/30 overflow-visible' viewBox='0 0 100 100'>
        <title>Stop</title>
        <rect x='7' y='7' width='33' height='86' rx='3' className='drop-shadow-md drop-shadow-gray-800' />
        <rect x='57' y='7' width='33' height='86' rx='3' className='drop-shadow-md drop-shadow-gray-800' />
      </svg>
    </button>
  );
};

const StartButton = ({onClick}: ButtonProps) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className='p-2 w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 border border-gray-500 shadow-gray-500 shadow-xs active:scale-110 active:bg-sky-300/50 transition'
    >
      <svg
        className='w-full h-full fill-green-500 drop-shadow-xs drop-shadow-green-500/30 overflow-visible'
        viewBox='0 0 100 100'
      >
        <title>Start</title>
        <polygon points='20,15 20,85, 80,50' />
      </svg>
    </button>
  );
};

type DetailInfoItemProps = {
  label: string;
  value: string | null;
  warningLevel?: 'LOW' | 'HIGH' | null;
};

const DetailInfoItem = ({label, value, warningLevel}: DetailInfoItemProps) => {
  const {t} = useTranslation();
  const id = `detailInfoId-${label}`;
  const textColorClassName =
    value === null
      ? 'text-gray-700/80 dark:text-gray-300/80'
      : warningLevel === null || warningLevel === undefined
        ? undefined
        : warningLevel === 'LOW'
          ? 'text-orange-400'
          : 'text-red-600';
  return (
    <div>
      <label htmlFor={id} className={`${textColorClassName} font-bold`}>
        {label}
      </label>
      <div id={id} className={textColorClassName}>
        {value ?? t('speedometer.notAvailable')}
      </div>
    </div>
  );
};

const SpeedometerContainer = () => {
  const {t} = useTranslation();
  const {isEnabled, hasPermission, requestPermission, setIsEnabled, value, lastUpdateDate, error} =
    useSpeedometerSensor();
  const currentDate = useCurrentDate(1000);
  const {speedUnit} = useSpeedUnit();
  const speed = calculateSpeedInUnit(value?.coords.speed ?? null, speedUnit);
  const speedometerOuterContainerElementRef = useRef<HTMLDivElement>(null);
  const shouldDownsizeSpeedometerInnerContainer = useDownsizeSpeedometer(speedometerOuterContainerElementRef);

  return (
    <div className='my-auto pt-[10vh] h-full font-mono text-black dark:text-white'>
      <div
        className='p-3 max-w-[90vmin] flex flex-col content-start items-center mx-auto'
        ref={speedometerOuterContainerElementRef}
      >
        <div className={`w-full origin-bottom transition ${shouldDownsizeSpeedometerInnerContainer ? 'scale-50' : ''}`}>
          <Speedometer value={speed} />
        </div>
        <div className='pt-2 px-3 self-end text-right text-base'>{speedUnit}</div>
      </div>
      <div className='py-6 grid place-items-center'>
        {isEnabled ? (
          <StopButton onClick={() => setIsEnabled(false)} />
        ) : (
          <StartButton
            onClick={async () => {
              if (!(await requestPermission())) {
                return;
              }
              setIsEnabled(true);
            }}
          />
        )}
      </div>
      {(hasPermission === false || error !== null) && (
        <div className='pt-5 text-red-400 grid place-items-center gap-y-2 text-sm font-bold whitespace-break-spaces text-center'>
          {hasPermission === false && <div>{t('speedometer.noGpsPermission')}</div>}
          {error !== null && <div>{t('speedometer.gpsError')}</div>}
        </div>
      )}
      {value !== null && (
        <div className='w-[90%] max-w-xl mx-auto p-3 pb-0'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-2 text-sm overflow-hidden *:whitespace-nowrap *:text-ellipsis *:overflow-hidden'>
            <DetailInfoItem
              label={t('speedometer.speed')}
              value={addSuffix(roundFractionDigits(value.coords.speed, 6), 'm/s') ?? null}
            />
            <DetailInfoItem
              label={t('speedometer.locationAccuracy')}
              value={addSuffix(roundFractionDigits(value.coords.accuracy, 6), 'm') ?? null}
              warningLevel={getWarningLevel(value.coords.accuracy, 'ACCURACY')}
            />
            <DetailInfoItem
              label={t('speedometer.latitude')}
              value={addSuffix(Math.abs(value.coords.latitude), getLatitudeSuffix(value.coords.latitude)) ?? null}
            />
            <DetailInfoItem
              label={t('speedometer.longitude')}
              value={addSuffix(Math.abs(value.coords.longitude), getLongitudeSuffix(value.coords.longitude)) ?? null}
            />
            <DetailInfoItem
              label={t('speedometer.altitude')}
              value={addSuffix(roundFractionDigits(value.coords.altitude, 6), 'm') ?? null}
            />
            <DetailInfoItem
              label={t('speedometer.altitudeAccuracy')}
              value={addSuffix(roundFractionDigits(value.coords.altitudeAccuracy, 6), 'm') ?? null}
              warningLevel={
                value.coords.altitudeAccuracy !== null && value.coords.altitudeAccuracy !== undefined
                  ? getWarningLevel(value.coords.altitudeAccuracy, 'ALTITUDE_ACCURACY')
                  : null
              }
            />
            <DetailInfoItem
              label={t('speedometer.travelDirection')}
              value={
                value.coords.course !== null && value.coords.course !== undefined
                  ? addSuffix(value.coords.course, '° ') + getAzimuthString(value.coords.course, true)
                  : null
              }
            />
            <DetailInfoItem label={t('speedometer.lastUpdate')} value={getRelativeTime(lastUpdateDate, currentDate)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeedometerContainer;
