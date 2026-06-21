const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true, // usamos <webview> no renderer para conteúdo web
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    // Em dev, Vite define VITE_DEV_SERVER_URL
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    // Em produção, carrega o index.html do build do Vite
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
