import {createRoot} from 'react-dom/client';

const App = () => {
  return (
    <div className='w-full h-full p-2 bg-white dark:bg-gray-700'>
      <div className='text-blue-500 font-bold'>Hello World!</div>
      <button className='p-2 border border-gray-700 bg-gray-100' type='button'>
        Click Me!
      </button>
    </div>
  );
};

createRoot(document.body).render(<App />);
