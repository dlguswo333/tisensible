import {useTranslation} from 'react-i18next';
import Speedometer from './Speedometer';
import useCurrentDate from './useCurrentDate';
import useSpeedometerSensor from './useSpeedometerSensor';
import useSpeedUnit from './useSpeedUnit';
import {calculateSpeedInUnit} from './util/speed';
import {addSuffix, getLatitudeSuffix, getLongitudeSuffix, getRelativeTime} from './util/string';

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

const SpeedometerContainer = () => {
  const {t} = useTranslation();
  const {isEnabled, hasPermission, requestPermission, setIsEnabled, value, lastUpdateDate, error} =
    useSpeedometerSensor();
  const currentDate = useCurrentDate(1000);
  const {speedUnit} = useSpeedUnit();
  const speed = calculateSpeedInUnit(value?.coords.speed ?? null, speedUnit);

  return (
    <div className='my-auto pt-[10vh] h-full font-mono text-black dark:text-white'>
      <div className='p-3 max-w-[90%] landscape:max-w-2xl flex flex-col content-start items-center mx-auto '>
        <Speedometer value={speed ?? null} />
        <div className='pt-2 px-3 self-end text-right text-base'>{speedUnit}</div>
      </div>
      <div className='py-8 grid place-items-center'>
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
      <div className='pt-5 text-red-400 grid place-items-center gap-y-2 text-sm font-bold whitespace-break-spaces text-center'>
        {hasPermission === false && <div>{t('speedometer.noGpsPermission')}</div>}
        {error !== null && <div>{t('speedometer.gpsError')}</div>}
      </div>
      {value !== null && (
        <div className='mx-auto p-3 pb-0 w-fit max-w-full grid grid-cols-2 gap-x-1 text-sm overflow-hidden *:whitespace-nowrap *:text-ellipsis *:overflow-hidden'>
          <div>{t('speedometer.lastUpdate')}:</div>
          <div>{getRelativeTime(lastUpdateDate, currentDate)}</div>
          <div>{t('speedometer.speed')}:</div>
          <div>{addSuffix(value.coords.speed, 'm/s') ?? t('speedometer.notAvailable')}</div>
          <div>{t('speedometer.accuracy')}:</div>
          <div>{addSuffix(value.coords.accuracy, 'm') ?? t('speedometer.notAvailable')}</div>
          <div>{t('speedometer.latitude')}:</div>
          <div>
            {addSuffix(Math.abs(value.coords.latitude), getLatitudeSuffix(value.coords.latitude)) ??
              t('speedometer.notAvailable')}
          </div>
          <div>{t('speedometer.longitude')}:</div>
          <div>
            {addSuffix(Math.abs(value.coords.longitude), getLongitudeSuffix(value.coords.longitude)) ??
              t('speedometer.notAvailable')}
          </div>
          <div>{t('speedometer.altitude')}:</div>
          <div>{addSuffix(value.coords.altitude, 'm') ?? t('speedometer.notAvailable')}</div>
          <div>{t('speedometer.altitudeAccuracy')}:</div>
          <div>{addSuffix(value.coords.altitudeAccuracy, 'm') ?? t('speedometer.notAvailable')}</div>
        </div>
      )}
    </div>
  );
};

export default SpeedometerContainer;
