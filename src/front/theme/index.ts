import {SystemBars, SystemBarsStyle} from '@capacitor/core';
import {atomWithDefault} from 'jotai/utils';
import z from 'zod';

export const themes = ['system', 'light', 'dark'] as const;
export const preferDarkMediaQuery = window.matchMedia('(prefers-color-scheme:dark)');

export const themeType = z.literal(themes);

const THEME_STORE_KEY = 'theme';

export const themeAtom = atomWithDefault<z.infer<typeof themeType>>(() => {
  const valueFromStore = localStorage.getItem(THEME_STORE_KEY);
  const parseResult = themeType.safeParse(valueFromStore);
  return parseResult.success ? parseResult.data : 'system';
});
export const applyTheme = (theme: z.infer<typeof themeType>, mediaQuery?: MediaQueryList | MediaQueryListEvent) => {
  if (theme === 'dark' || (theme === 'system' && (mediaQuery ?? preferDarkMediaQuery).matches)) {
    document.body.classList.add('dark');
    SystemBars.setStyle({style: SystemBarsStyle.Dark});
  } else {
    document.body.classList.remove('dark');
    SystemBars.setStyle({style: SystemBarsStyle.Light});
  }
};
export const updateTheme = (newValue: z.infer<typeof themeType>) => {
  localStorage.setItem(THEME_STORE_KEY, newValue);
  applyTheme(newValue);
};
