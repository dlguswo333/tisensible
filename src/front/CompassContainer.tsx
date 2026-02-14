import {useEffect, useState} from 'react';
import Compass from './Compass';

const CompassContainer = () => {
  const [rotate, setRotate] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setRotate((rotate) => (rotate + 0.5) % 360), 10);
    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <div>
      <Compass rotate={rotate} />
      <div className='text-black dark:text-white'>{rotate}</div>
    </div>
  );
};

export default CompassContainer;
