import {useAtomValue} from 'jotai';
import {useEffect} from 'react';
import {applyTheme, preferDarkMediaQuery, themeAtom} from '.';

const useSyncTheme = () => {
  const currentTheme = useAtomValue(themeAtom);

  useEffect(() => {
    const syncTheme = (event: MediaQueryListEvent | MediaQueryList) => {
      applyTheme(currentTheme, event);
    };

    syncTheme(preferDarkMediaQuery);
    preferDarkMediaQuery.addEventListener('change', syncTheme);
    return () => {
      preferDarkMediaQuery.removeEventListener('change', syncTheme);
    };
  }, [currentTheme]);
};

export default useSyncTheme;
