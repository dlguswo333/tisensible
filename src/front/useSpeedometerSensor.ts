import type {Position} from '@capacitor/geolocation';
import {useEffect, useState} from 'react';
import speedometerSensor from '../back/speedometerSensor';

/** Get compass sensor data relative to earth's magnetic field. */
const useSpeedometerSensor = () => {
  const [value, setValue] = useState<Position | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdateDate, setLastUpdateDate] = useState(new Date());
  const [isEnabled, setIsEnabled] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const requestPermission = async () => {
    const permissionResult = await speedometerSensor.requestPermission();
    setHasPermission(permissionResult);
    return permissionResult;
  };

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    setError(null);
    const id = speedometerSensor.subscribe((value) => {
      if (value.status === 'error') {
        setValue(null);
        setError(value.error);
        setIsEnabled(false);
        return;
      }
      if (value.status === 'none') {
        setValue(null);
        return;
      }
      setValue(value.position);
      setLastUpdateDate(new Date());
    });

    return () => {
      setHasPermission(null);
      setValue(null);
      speedometerSensor.unsubscribe(id);
    };
  }, [isEnabled]);

  return {
    isEnabled,
    setIsEnabled,
    hasPermission,
    requestPermission,
    value,
    lastUpdateDate,
    error,
  };
};

export default useSpeedometerSensor;
