import Speedometer from './Speedometer';
import useCurrentDate from './useCurrentDate';
import useSpeedometerSensor from './useSpeedometerSensor';
import {calculateSpeedInUnit} from './util/speed';
import {getRelativeTime} from './util/string';

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
        <title>Stop</title>
        <polygon points='20,15 20,85, 80,50' />
      </svg>
    </button>
  );
};

const SpeedometerContainer = () => {
  const {isEnabled, hasPermission, requestPermission, setIsEnabled, value, lastUpdateDate} = useSpeedometerSensor();
  const currentDate = useCurrentDate(1000);
  const relLastUpdateDate = getRelativeTime(lastUpdateDate, currentDate);
  const unit = 'km/h' as const;
  const speed = calculateSpeedInUnit(value?.coords.speed ?? null, unit);

  return (
    <div className='my-auto pt-[10vh] h-full font-mono text-black dark:text-white'>
      <div className='p-3 max-w-[90%] landscape:max-w-2xl flex flex-col content-start items-center mx-auto '>
        <Speedometer value={speed ?? null} />
        <div className='pt-2 px-3 self-end text-right text-base'>{unit}</div>
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
      <div className='pt-5 text-red-400 text-xl grid place-items-center'>
        {hasPermission === false && (
          <div>The permission has not been granted. Please grant the GPS permission in app settings.</div>
        )}
      </div>
      {value !== null && (
        <div className='mx-auto p-3 pb-0 w-fit max-w-full grid grid-cols-2 gap-x-1 text-sm overflow-hidden *:whitespace-nowrap *:text-ellipsis *:overflow-hidden'>
          <div>last update:</div>
          <div>{relLastUpdateDate}</div>
          <div>speed:</div>
          <div>{value.coords.speed ?? 'not available'}</div>
          <div>accuracy:</div>
          <div>{value.coords.accuracy ?? 'not available'}</div>
          <div>latitude:</div>
          <div>{value.coords.latitude ?? 'not available'}</div>
          <div>longitude:</div>
          <div>{value.coords.longitude ?? 'not available'}</div>
          <div>altitude:</div>
          <div>{value.coords.altitude ?? 'not available'}</div>
        </div>
      )}
    </div>
  );
};

export default SpeedometerContainer;
