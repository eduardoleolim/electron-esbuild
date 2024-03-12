const { BrowserWindow } = require('electron');
const path = require('path');

class ElectronWindow extends BrowserWindow {
  url;

  constructor() {
    super({ show: false });
    this.url = 'http://localhost:8080';
    if (process.env.NODE_ENV === 'production') {
      this.url = `file://${path.join(__dirname, '../renderer/index.html')}`;
    }
  }

  show() {
    this.loadURL(this.url).then(() => {
      super.show();
      this.webContents.openDevTools({ mode: 'detach' });
    });
  }
}

module.exports.ElectronWindow = ElectronWindow;
