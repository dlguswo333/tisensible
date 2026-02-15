import {useEffect, useState} from 'react';
import Compass from './Compass';
import {getAzimuthString} from './util/string';

const CompassContainer = () => {
  const [rotate, setRotate] = useState(0);
  const quantizedRotate = Math.round(rotate);

  useEffect(() => {
    const id = setInterval(() => setRotate((rotate) => (rotate + 0.5) % 360), 10);
    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <div>
      <Compass rotate={rotate ?? 0} />
      <div className='text-black darK:text-white'>
        <div className='text-3xl font-bold text-center font-mono text-black dark:text-white whitespace-pre-wrap'>
          {quantizedRotate.toString().padStart(3, ' ')}
          {'° '}
          {getAzimuthString(quantizedRotate).padEnd(2, ' ')}
        </div>
      </div>
    </div>
  );
};

export default CompassContainer;
