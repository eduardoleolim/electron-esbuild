import { app } from 'electron';

import { ElectronWindow } from './ElectronWindow';

(async () => {
  try {
    await app.whenReady();

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    new ElectronWindow().show();
  } catch (error) {
    console.log(error);
  }
})();
