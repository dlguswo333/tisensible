import {App as CapacitorApp} from '@capacitor/app';
import {useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router';
import CompassContainer from './CompassContainer';
import NavBar from './navBar/NavBar';
import SettingsContainer from './SettingsContainer';
import SpeedometerContainer from './SpeedometerContainer';
import useUserAgreement from './useUserAgreement';
import './i18n/index';
import useSyncTheme from './theme/useSyncTheme';

const App = () => {
  useUserAgreement(true);
  useSyncTheme();

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
    <div id='app' className='w-full h-full px-2 bg-white dark:bg-gray-900 relative flex flex-col items-stretch'>
      <div className='h-full flex flex-col relative overflow-auto'>
        <div className='min-h-full flex-none flex flex-col'>
          <Routes>
            <Route
              path='compass'
              element={
                <>
                  <CompassContainer />
                  <NavBar />
                </>
              }
            />
            <Route
              path='speedometer'
              element={
                <>
                  <SpeedometerContainer />
                  <NavBar />
                </>
              }
            />
            <Route path='settings' element={<SettingsContainer />} />
            <Route path='*' element={<Navigate replace={true} to='/compass' />} />
          </Routes>
        </div>
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
