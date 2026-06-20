import i18n from 'i18next';
import {atomWithDefault} from 'jotai/utils';
import {initReactI18next} from 'react-i18next';
import z from 'zod';
import en from './en.json';
import ko from './ko.json';

export const langType = z.literal(['en', 'ko']);
export const langs = ['en', 'ko'];

const DEFAULT_LANG = 'en';
const CURRENT_LANG_STORE_KEY = 'currentLang';

const getInitialLang = () => {
  const savedLang = localStorage.getItem(CURRENT_LANG_STORE_KEY);
  return savedLang || DEFAULT_LANG;
};

export const setInitialLang = (newLang: z.infer<typeof langType>) => {
  localStorage.setItem(CURRENT_LANG_STORE_KEY, newLang);
};

export const currentLangAtom = atomWithDefault(getInitialLang);

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: en,
      },
      ko: {
        translation: ko,
      },
    },
    ns: 'translation',
    lng: getInitialLang(),
    fallbackLng: DEFAULT_LANG,
    interpolation: {
      escapeValue: false,
    },
  });
