import {createRoot} from 'react-dom/client';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router';
import CompassContainer from './CompassContainer';
import GlobalNav from './GlobalNav';
import SettingsContainer from './SettingsContainer';

const App = () => {
  return (
    <BrowserRouter>
      <div className='w-full h-full p-2 bg-white dark:bg-gray-900 flex flex-col'>
        <div className='relative flex-1 flex flex-col'>
          <div className='text-blue-500 font-bold'>Hello World!</div>
          <Routes>
            <Route path='compass' element={<CompassContainer />} />
            <Route path='settings' element={<SettingsContainer />} />
            <Route path='*' element={<Navigate to='/compass' />} />
          </Routes>
          <GlobalNav />
        </div>
        <div></div>
      </div>
    </BrowserRouter>
  );
};

createRoot(document.body).render(<App />);
