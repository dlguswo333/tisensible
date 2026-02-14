import {createRoot} from 'react-dom/client';

const App = () => {
  return <div className='text-blue-500 font-bold'>Hello World!</div>;
};

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(<App />);
}
