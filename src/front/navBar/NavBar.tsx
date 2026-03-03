import {memo, type ReactElement} from 'react';
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
      className='border-gray-400 dark:border-gray-600 text-black dark:text-white not-last:border-r px-2 py-1 flex flex-col items-center justify-center text-[0.7rem] active:bg-sky-300/50 [&.active]:bg-sky-300/50 transition-colors'
    >
      <div className='size-7.5 grid place-items-center'>{icon}</div>
      {text}
    </NavLink>
  );
};

const NavBar = memo(() => {
  return (
    <nav className='sticky my-5 bottom-5 self-center border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 border rounded-sm'>
      <div className='overflow-hidden flex flex-row'>
        <Button text='Compass' icon={<CompassIcon />} to='/compass' replace={true} />
        <Button text='Speedometer' icon={<SpeedometerIcon />} to='/speedometer' replace={true} />
        <Button text='Settings' icon={<SettingsIcon />} to='/settings' replace={false} />
      </div>
    </nav>
  );
});
NavBar.displayName = 'NavBar';

export default NavBar;
