import {useAtom} from 'jotai';
import {useCallback} from 'react';
import {themeAtom, themeType, updateTheme} from '.';

const useTheme = () => {
  const [currentTheme, rawSetTheme] = useAtom(themeAtom);

  const setTheme = useCallback(
    (newValue: string) => {
      const parseResult = themeType.safeParse(newValue);
      if (parseResult.success) {
        updateTheme(parseResult.data);
        rawSetTheme(parseResult.data);
      }
      return parseResult.success;
    },
    [rawSetTheme],
  );

  return {
    currentTheme,
    setTheme,
  };
};

export default useTheme;
