import type {PropsWithChildren} from 'react';
import useSpeedUnit from './useSpeedUnit';

const SectionTitle = ({children}: PropsWithChildren) => {
  return <h2 className='text-xl font-semibold'>{children}</h2>;
};

const Section = ({children}: PropsWithChildren) => {
  return <section className='rounded-xl p-3 bg-gray-50 dark:bg-gray-800'>{children}</section>;
};

const SettingTitle = ({children}: PropsWithChildren) => {
  return <h3 className='text-lg'>{children}</h3>;
};

const Setting = ({children}: PropsWithChildren) => {
  return (
    <div className='py-4 flex flex-row justify-between items-center not-last:border-b border-gray-300 dark:border-gray-600'>
      {children}
    </div>
  );
};

const SettingsContainer = () => {
  const {speedUnit, setSpeedUnit, speedUnitOptions} = useSpeedUnit();

  return (
    <div className='size-full px-2 text-black dark:text-white'>
      <div>
        <h1 className='px-3 py-5 text-3xl font-bold'>Settings</h1>
      </div>
      <Section>
        <SectionTitle>Speedometer</SectionTitle>
        <Setting>
          <SettingTitle>Speed Unit</SettingTitle>
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
