import {useAtomValue} from 'jotai';
import {useEffect} from 'react';
import {preferDarkMediaQuery, themeAtom} from '.';

const useSyncTheme = () => {
  const currentTheme = useAtomValue(themeAtom);

  useEffect(() => {
    const onChange = (event: MediaQueryListEvent) => {
      if (currentTheme !== 'system') {
        return;
      }
      if (event.matches) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    };
    preferDarkMediaQuery.addEventListener('change', onChange);

    return () => {
      preferDarkMediaQuery.removeEventListener('change', onChange);
    };
  }, [currentTheme]);
};

export default useSyncTheme;
