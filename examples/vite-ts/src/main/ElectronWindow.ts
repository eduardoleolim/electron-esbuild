import { BrowserWindow, shell } from 'electron';
import path from 'path';

export class ElectronWindow extends BrowserWindow {
  private url: string;

  constructor() {
    super({
      width: 800,
      height: 600,
      show: false,
    });
    this.url = 'http://localhost:8080';
    if (process.env.NODE_ENV === 'production') {
      this.url = `file://${path.join(__dirname, '../renderer/index.html')}`;
    }
    this.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url);
      return { action: 'deny' };
    });
  }

  async show() {
    await this.loadURL(this.url);
    super.show();
    if (process.env.NODE_ENV === 'development') {
      this.webContents.openDevTools({ mode: 'detach' });
    }
  }
}
