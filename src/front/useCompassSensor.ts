import {useEffect, useState} from 'react';
import compassSensor from '../back/compassSensor';
import useUserAgreement from './useUserAgreement';

/** Get compass sensor data relative to earth's magnetic field. */
const useCompassSensor = () => {
  const [value, setValue] = useState<DeviceOrientationEvent | null>(null);
  const [lastUpdateDate, setLastUpdateDate] = useState(new Date());

  const userAgreement = useUserAgreement(false);

  useEffect(() => {
    if (!userAgreement) {
      return;
    }
    const id = compassSensor.subscribe((value) => {
      if (!value?.absolute) {
        return;
      }
      setValue(value);
      setLastUpdateDate(new Date());
    });

    return () => {
      compassSensor.unsubscribe(id);
    };
  }, [userAgreement]);

  return {
    value,
    lastUpdateDate,
  };
};

export default useCompassSensor;
