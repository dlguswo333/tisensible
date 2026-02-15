import Compass from './Compass';
import useCompassSensor from './useCompassSensor';
import {getAzimuthString} from './util/string';

const CompassContainer = () => {
  const {value} = useCompassSensor();
  const screenAngle = screen.orientation.angle;
  const rotate = value?.alpha ? (value.alpha - screenAngle + 360) % 360 : 0;
  const quantizedRotate = Math.round(rotate);

  return (
    <div className='mt-auto mb-auto pt-[10vh] h-full overflow-auto'>
      <Compass rotate={rotate ?? 0} />
      <div className='text-3xl pt-8 font-bold text-center font-mono text-black dark:text-white whitespace-pre-wrap'>
        {quantizedRotate.toString().padStart(3, ' ')}
        {'° '}
        {getAzimuthString(quantizedRotate).padEnd(2, ' ')}
        <div className='h-3' />
        <div className='text-xs flex flex-col items-center'>
          <div>Screen Orientation: {screenAngle}°</div>
        </div>
      </div>
    </div>
  );
};

export default CompassContainer;
