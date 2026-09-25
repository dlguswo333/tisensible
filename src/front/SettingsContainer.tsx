import type {PropsWithChildren} from 'react';
import {useTranslation} from 'react-i18next';
import {langs} from './i18n';
import useLang from './i18n/useLang';
import {themes} from './theme/index';
import useTheme from './theme/useTheme';
import useSpeedUnit from './useSpeedUnit';

const SectionTitle = ({children}: PropsWithChildren) => {
  return <h2 className='text-xl font-semibold'>{children}</h2>;
};

const Section = ({children}: PropsWithChildren) => {
  return (
    <section className='rounded-lg p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 not-last-of-type:mb-9'>
      {children}
    </section>
  );
};

const SettingTitle = ({children}: PropsWithChildren) => {
  return <h3 className='text-lg'>{children}</h3>;
};

const Setting = ({children}: PropsWithChildren) => {
  return <div className='py-4 flex flex-row justify-between items-center'>{children}</div>;
};

const SettingsContainer = () => {
  const {speedUnit, setSpeedUnit, speedUnitOptions} = useSpeedUnit();
  const {currentLang, setLang} = useLang();
  const {currentTheme, setTheme} = useTheme();
  const {t} = useTranslation();

  return (
    <div className='mx-auto size-full max-w-lg px-4 text-black dark:text-white'>
      <div>
        <h1 className='py-3.5 text-2xl font-bold'>{t('settings.title')}</h1>
      </div>
      <Section>
        <SectionTitle>{t('settings.general')}</SectionTitle>
        <Setting>
          <SettingTitle>{t('settings.language')}</SettingTitle>
          <select
            className='p-1 border border-gray-300 dark:border-gray-600 rounded-lg'
            value={currentLang}
            onChange={(e) => {
              const value = e.target.value;
              setLang(value);
            }}
          >
            {langs.map((option) => (
              <option key={option} value={option}>
                {t(option)}
              </option>
            ))}
          </select>
        </Setting>
        <Setting>
          <SettingTitle>{t('settings.theme')}</SettingTitle>
          <select
            className='p-1 border border-gray-300 dark:border-gray-600 rounded-lg'
            value={currentTheme}
            onChange={(e) => {
              const value = e.target.value;
              setTheme(value);
            }}
          >
            {themes.map((option) => (
              <option key={option} value={option}>
                {t(`settings.${option}`)}
              </option>
            ))}
          </select>
        </Setting>
      </Section>
      <Section>
        <SectionTitle>{t('settings.speedometer')}</SectionTitle>
        <Setting>
          <SettingTitle>{t('settings.speedUnit')}</SettingTitle>
          <select
            className='p-1 border border-gray-300 dark:border-gray-600 rounded-lg'
            value={speedUnit}
            onChange={(e) => {
              const value = e.target.value;
              setSpeedUnit(value);
            }}
          >
            {speedUnitOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Setting>
      </Section>
    </div>
  );
};

export default SettingsContainer;
