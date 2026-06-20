import {useAtom} from 'jotai';
import {useTranslation} from 'react-i18next';
import {currentLangAtom, langs, langType, setInitialLang} from '.';

const useLang = () => {
  const {i18n} = useTranslation();
  const [currentLang, setCurrentLang] = useAtom(currentLangAtom);

  const setLang = (newValue: string) => {
    const parseResult = langType.safeParse(newValue);
    if (!parseResult.success) {
      return false;
    }
    const newLang = parseResult.data;
    i18n.changeLanguage(newLang);
    setCurrentLang(newLang);
    setInitialLang(newLang);
  };

  return {currentLang, langs, setLang};
};

export default useLang;
