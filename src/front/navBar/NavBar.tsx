import {memo, type ReactElement} from 'react';
import {useTranslation} from 'react-i18next';
import {NavLink} from 'react-router';
import CompassIcon from './CompassIcon';
import SettingsIcon from './SettingsIcon';
import SpeedometerIcon from './SpeedometerIcon';

type ButtonProps = {
  text: string;
  icon: ReactElement;
  to: string;
  replace: boolean;
};

const Button = ({text, icon, to, replace}: ButtonProps) => {
  return (
    <NavLink
      to={to}
      draggable={false}
      replace={replace}
      className='border-gray-400 dark:border-gray-600 text-black dark:text-white not-last:border-r min-w-15 px-5 first:pl-6 last:pr-6 py-1.5 flex flex-col items-center justify-center text-[0.7rem] active:bg-sky-300/50 [&.active]:bg-sky-300/50 transition-colors'
    >
      <div className='size-7.5 grid place-items-center'>{icon}</div>
      {text}
    </NavLink>
  );
};

type NavBarProps = {
  hide: boolean;
};

const NavBar = memo(({hide}: NavBarProps) => {
  const {t} = useTranslation();

  return (
    <nav
      inert={hide}
      className='shrink-0 sticky mt-4 mb-8 bottom-8 self-center flex overflow-clip [overflow-clip-margin:32px]'
    >
      <div
        className={`flex flex-row border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm shadow-gray-600/50 dark:shadow-black/50 border rounded-4xl overflow-hidden transition-transform ${hide ? 'translate-y-56' : ''}`}
      >
        <Button text={t('navBar.compass')} icon={<CompassIcon />} to='/compass' replace={true} />
        <Button text={t('navBar.speedometer')} icon={<SpeedometerIcon />} to='/speedometer' replace={true} />
        <Button text={t('navBar.settings')} icon={<SettingsIcon />} to='/settings' replace={false} />
      </div>
    </nav>
  );
});
NavBar.displayName = 'NavBar';

export default NavBar;
