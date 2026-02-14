import {useNavigate} from 'react-router';

type ButtonProps = {
  text: string;
  onClick: () => unknown;
};

const Button = ({text, onClick}: ButtonProps) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className='border-gray-400 dark:border-gray-600 text-black dark:text-white not-last:border-r px-2 py-1 text-[0.7rem] active:bg-sky-300/50 transition-colors'
    >
      {text}
    </button>
  );
};
const GlobalNav = () => {
  const navigate = useNavigate();

  return (
    <nav className='absolute overflow-hidden bottom-5 self-center flex flex-row border-gray-400 dark:border-gray-600 border rounded-sm'>
      <Button text='Compass' onClick={() => navigate('/compass', {replace: true})} />
      <Button text='Settings' onClick={() => navigate('/settings', {replace: false})} />
    </nav>
  );
};

export default GlobalNav;
