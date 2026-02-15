import Compass from './Compass';
import useCompassSensor from './useCompassSensor';
import {getAzimuthString} from './util/string';

const CompassContainer = () => {
  const {value} = useCompassSensor();
  const rotate = value?.alpha || 0;
  const quantizedRotate = Math.round(rotate);

  return (
    <div className='mt-auto mb-auto pt-[10vh] h-full overflow-auto'>
      <Compass rotate={rotate ?? 0} />
      <div className='text-3xl pt-8 font-bold text-center font-mono text-black dark:text-white whitespace-pre-wrap'>
        {quantizedRotate.toString().padStart(3, ' ')}
        {'° '}
        {getAzimuthString(quantizedRotate).padEnd(2, ' ')}
        <br />
        {value?.absolute.toString() || 'null'} {Math.round(value?.alpha ?? 0)} {Math.round(value?.beta ?? 0)}{' '}
        {Math.round(value?.gamma ?? 0)}
      </div>
    </div>
  );
};

export default CompassContainer;
