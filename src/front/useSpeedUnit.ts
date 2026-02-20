import {useAtom} from 'jotai';
import {atomWithDefault} from 'jotai/utils';
import {useCallback} from 'react';
import z from 'zod';

const SPEED_UNIT_OPTIONS = ['km/h', 'mi/h'] as const;
const speedUnitType = z.literal(SPEED_UNIT_OPTIONS);

const SPEED_UNIT_STORE_KEY = 'speedUnit';
const DEFAULT_SPEED_UNIT = 'km/h';

const speedUnitAtom = atomWithDefault<z.infer<typeof speedUnitType>>(() => {
  const valueFromStore = localStorage.getItem(SPEED_UNIT_STORE_KEY);
  const parseResult = z.safeParse(speedUnitType, valueFromStore);
  if (parseResult.success) {
    return parseResult.data;
  }
  return DEFAULT_SPEED_UNIT;
});

const useSpeedUnit = () => {
  const [speedUnit, rawSetSpeedUnit] = useAtom(speedUnitAtom);

  const setSpeedUnit = useCallback(
    (value: string) => {
      const parseResult = speedUnitType.safeParse(value);
      if (parseResult.success) {
        rawSetSpeedUnit(parseResult.data);
        localStorage.setItem(SPEED_UNIT_STORE_KEY, parseResult.data);
      }
    },
    [rawSetSpeedUnit],
  );

  return {
    speedUnit,
    setSpeedUnit,
    speedUnitOptions: SPEED_UNIT_OPTIONS,
  };
};

export default useSpeedUnit;
