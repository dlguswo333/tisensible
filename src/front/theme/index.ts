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

export const updateTheme = (newValue: z.infer<typeof themeType>) => {
  localStorage.setItem(THEME_STORE_KEY, newValue);
  if (newValue === 'dark' || (newValue === 'system' && preferDarkMediaQuery.matches)) {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
};
