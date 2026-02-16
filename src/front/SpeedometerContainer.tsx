import useSpeedometerSensor from './useSpeedometerSensor';

type ButtonProps = {
  onClick: () => unknown;
};
const StopButton = ({onClick}: ButtonProps) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className='p-3 w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 border border-gray-500 shadow-gray-500 shadow-xs active:scale-110 active:bg-sky-300/50 transition'
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
      className='p-2 w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 border border-gray-500 shadow-gray-500 shadow-xs active:scale-110 active:bg-sky-300/50 transition'
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
  const {isEnabled, setIsEnabled, value} = useSpeedometerSensor();

  return (
    <div className='mt-auto mb-auto pt-[10vh] h-full overflow-auto'>
      <div>
        {value !== null && (
          <div>
            <div>speed: {value.coords.speed ?? 'speed not available'}</div>
            <div>accuracy: {value.coords.accuracy ?? 'accuracy not available'}</div>
            <div>longitude: {value.coords.longitude ?? 'longitude not available'}</div>
            <div>latitude: {value.coords.latitude ?? 'latitude not available'}</div>
          </div>
        )}
      </div>
      <div className='grid place-items-center'>
        {isEnabled ? (
          <StopButton onClick={() => setIsEnabled(false)} />
        ) : (
          <StartButton onClick={() => setIsEnabled(true)} />
        )}
      </div>
    </div>
  );
};

export default SpeedometerContainer;
