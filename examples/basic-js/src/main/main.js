const { app } = require('electron');
const { ElectronWindow } = require('./ElectronWindow');

app.on('ready', () => {
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  new ElectronWindow().show();
});
