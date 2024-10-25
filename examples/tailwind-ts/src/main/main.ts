import { app } from 'electron';

import { ElectronWindow } from './ElectronWindow';

(async () => {
  await app.whenReady();

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  new ElectronWindow().show();
})();
