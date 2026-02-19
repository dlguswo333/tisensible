import {NavLink} from 'react-router';

type ButtonProps = {
  text: string;
  to: string;
  replace: boolean;
};

const Button = ({text, to, replace}: ButtonProps) => {
  return (
    <NavLink
      to={to}
      replace={replace}
      className='border-gray-400 dark:border-gray-600 text-black dark:text-white not-last:border-r px-2 py-1 text-[0.7rem] active:bg-sky-300/50 [&.active]:bg-sky-300/50 transition-colors'
    >
      {text}
    </NavLink>
  );
};
const GlobalNav = () => {
  return (
    <nav className='sticky my-5 bottom-5 self-center border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 border rounded-sm'>
      <div className='overflow-hidden flex flex-row'>
        <Button text='Compass' to='/compass' replace={true} />
        <Button text='Speedometer' to='/speedometer' replace={true} />
        <Button text='Settings' to='/settings' replace={false} />
      </div>
    </nav>
  );
};

export default GlobalNav;
