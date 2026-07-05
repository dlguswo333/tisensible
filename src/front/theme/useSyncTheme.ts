import {SystemBars, SystemBarsStyle} from '@capacitor/core';
import {useAtomValue} from 'jotai';
import {useEffect} from 'react';
import {preferDarkMediaQuery, themeAtom} from '.';

const useSyncTheme = () => {
  const currentTheme = useAtomValue(themeAtom);

  useEffect(() => {
    const syncTheme = (event: MediaQueryListEvent | MediaQueryList) => {
      if (currentTheme === 'dark' || (currentTheme === 'system' && event.matches)) {
        document.body.classList.add('dark');
        SystemBars.setStyle({style: SystemBarsStyle.Dark});
      } else {
        document.body.classList.remove('dark');
        SystemBars.setStyle({style: SystemBarsStyle.Light});
      }
    };

    syncTheme(preferDarkMediaQuery);
    preferDarkMediaQuery.addEventListener('change', syncTheme);
    return () => {
      preferDarkMediaQuery.removeEventListener('change', syncTheme);
    };
  }, [currentTheme]);
};

export default useSyncTheme;
