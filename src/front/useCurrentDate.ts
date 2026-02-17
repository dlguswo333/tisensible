import {useEffect, useState} from 'react';

const useCurrentDate = (ms: number) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  useEffect(() => {
    const timerID = setInterval(() => {
      setCurrentDate(new Date());
    }, ms);
    return () => {
      clearInterval(timerID);
    };
  }, [ms]);

  return currentDate;
};

export default useCurrentDate;
