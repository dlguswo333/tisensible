import type {Position} from '@capacitor/geolocation';
import {useEffect, useState} from 'react';
import SpeedometerSensor from '../back/speedometerSensor';

const speedometerSensor = new SpeedometerSensor();

/** Get compass sensor data relative to earth's magnetic field. */
const useSpeedometerSensor = () => {
  const [value, setValue] = useState<Position | null>(null);
  const [lastUpdateDate, setLastUpdateDate] = useState(new Date());
  const [isEnabled, setIsEnabled] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const requestPermission = async () => {
    const permissionResult = await speedometerSensor.requestPermission();
    setHasPermission(permissionResult);
    return permissionResult;
  };

  useEffect(() => {
    let id: string | null = null;
    const callback = async () => {
      if (!isEnabled) {
        return;
      }
      id = speedometerSensor.subscribe((value) => {
        setValue(value);
        setLastUpdateDate(new Date());
      });
    };
    callback();

    return () => {
      setHasPermission(null);
      setValue(null);
      if (id !== null) {
        speedometerSensor.unsubscribe(id);
      }
    };
  }, [isEnabled]);

  return {
    isEnabled,
    setIsEnabled,
    hasPermission,
    requestPermission,
    value,
    lastUpdateDate,
  };
};

export default useSpeedometerSensor;
