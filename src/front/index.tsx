import {App as CapacitorApp} from '@capacitor/app';
import {useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router';
import CompassContainer from './CompassContainer';
import GlobalNav from './GlobalNav';
import SettingsContainer from './SettingsContainer';

const App = () => {
  useEffect(() => {
    const registerBackButtonListener = () => {
      CapacitorApp.addListener('backButton', ({canGoBack}) => {
        if (!canGoBack) {
          CapacitorApp.exitApp();
        } else {
          window.history.back();
        }
      });
    };
    registerBackButtonListener();
    return () => {
      CapacitorApp.removeAllListeners();
    };
  }, []);

  return (
    <div className='w-full h-full p-2 bg-white dark:bg-gray-900 flex flex-col'>
      <div className='relative flex-1 flex flex-col'>
        <Routes>
          <Route
            path='compass'
            element={
              <>
                <CompassContainer />
                <GlobalNav />
              </>
            }
          />
          <Route path='settings' element=<SettingsContainer /> />
          <Route path='*' element={<Navigate replace={true} to='/compass' />} />
        </Routes>
      </div>
      <div></div>
    </div>
  );
};

createRoot(document.body).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
