import type {Position} from '@capacitor/geolocation';
import {useEffect, useState} from 'react';
import SpeedometerSensor from '../back/speedometerSensor';

const speedometerSensor = new SpeedometerSensor();

/** Get compass sensor data relative to earth's magnetic field. */
const useSpeedometerSensor = () => {
  const [value, setValue] = useState<Position | null>(null);
  const [lastUpdateDate, setLastUpdateDate] = useState(new Date());
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    let id: string | null = null;
    const callback = async () => {
      if (!isEnabled) {
        await speedometerSensor.stop();
        return;
      }
      const hasPermission = await speedometerSensor.requestPermission();
      if (!hasPermission) {
        return;
      }
      id = speedometerSensor.subscribe((value) => {
        setValue(value);
        setLastUpdateDate(new Date());
      });
      speedometerSensor.start();
    };
    callback();

    return () => {
      if (id !== null) {
        speedometerSensor.unsubscribe(id);
      }
    };
  }, [isEnabled]);

  return {
    isEnabled,
    setIsEnabled,
    value,
    lastUpdateDate,
  };
};

export default useSpeedometerSensor;
