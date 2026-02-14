import type {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dlguswo333.tisensible',
  appName: 'tiSensible',
  webDir: 'dist',
  plugins: {
    SystemBars: {
      insetsHandling: 'css',
    },
  },
};

export default config;
