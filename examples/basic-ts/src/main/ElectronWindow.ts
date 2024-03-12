import { BrowserWindow } from 'electron';
import path from 'path';

export class ElectronWindow extends BrowserWindow {
  private url: string;

  constructor() {
    super({ show: false });
    this.url = 'http://localhost:8080';
    if (process.env.NODE_ENV === 'production') {
      this.url = `file://${path.join(__dirname, '../renderer/index.html')}`;
    }
  }

  async show() {
    await this.loadURL(this.url);
    super.show();
    this.webContents.openDevTools({ mode: 'detach' });
  }
}
