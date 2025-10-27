const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

let mainWindow;
let splashWindow;

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 400,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  splashWindow.loadFile('splash.html');
  
  // Check for updates
  autoUpdater.checkForUpdatesAndNotify();
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    backgroundColor: '#000000',
    frame: false, // Убираем стандартную рамку
    titleBarStyle: 'hidden',
    show: false
  });

  mainWindow.loadFile('index.html');
  
  // Показываем основное окно когда готово
  mainWindow.once('ready-to-show', () => {
    setTimeout(() => {
      if (splashWindow) {
        splashWindow.close();
      }
      mainWindow.show();
    }, 2000);
  });

  // Открываем внешние ссылки в браузере по умолчанию
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Auto Updater events
autoUpdater.on('update-available', () => {
  splashWindow.webContents.send('update-status', 'Update available. Downloading...');
});

autoUpdater.on('update-not-available', () => {
  splashWindow.webContents.send('update-status', 'Launching application...');
});

autoUpdater.on('download-progress', (progressObj) => {
  splashWindow.webContents.send('download-progress', progressObj.percent);
});

autoUpdater.on('update-downloaded', () => {
  splashWindow.webContents.send('update-status', 'Update downloaded. Restarting...');
  setTimeout(() => {
    autoUpdater.quitAndInstall();
  }, 1000);
});

app.whenReady().then(() => {
  createSplashWindow();
  createMainWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

// IPC Handlers
ipcMain.handle('download-app', async (event, appData) => {
  await shell.openExternal(appData.downloadUrl);
  return { success: true };
});

ipcMain.handle('window-controls', (event, action) => {
  const win = BrowserWindow.getFocusedWindow();
  if (!win) return;

  switch (action) {
    case 'minimize':
      win.minimize();
      break;
    case 'maximize':
      win.isMaximized() ? win.unmaximize() : win.maximize();
      break;
    case 'close':
      win.close();
      break;
  }
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});