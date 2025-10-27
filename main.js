const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');

// Проверяем что electron-updater доступен
let autoUpdater;
try {
  autoUpdater = require('electron-updater').autoUpdater;
} catch (error) {
  console.log('Auto updater not available:', error.message);
  autoUpdater = null;
}

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
  
  // Проверяем обновления если доступно
  if (autoUpdater) {
    autoUpdater.checkForUpdatesAndNotify();
  } else {
    // Fallback: симулируем проверку
    setTimeout(() => {
      splashWindow.webContents.send('update-status', 'Launching application...');
      setTimeout(() => {
        if (splashWindow) {
          splashWindow.close();
        }
        if (mainWindow) {
          mainWindow.show();
        }
      }, 1000);
    }, 2000);
  }
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
    frame: false,
    titleBarStyle: 'hidden',
    show: false
  });

  mainWindow.loadFile('index.html');
  
  mainWindow.once('ready-to-show', () => {
    // Окно покажется после закрытия splash screen
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Auto Updater events
if (autoUpdater) {
  autoUpdater.on('update-available', () => {
    if (splashWindow) {
      splashWindow.webContents.send('update-status', 'Update available. Downloading...');
    }
  });

  autoUpdater.on('update-not-available', () => {
    if (splashWindow) {
      splashWindow.webContents.send('update-status', 'Launching application...');
      setTimeout(() => {
        if (splashWindow) {
          splashWindow.close();
        }
        if (mainWindow) {
          mainWindow.show();
        }
      }, 1000);
    }
  });

  autoUpdater.on('download-progress', (progressObj) => {
    if (splashWindow) {
      splashWindow.webContents.send('download-progress', progressObj.percent);
    }
  });

  autoUpdater.on('update-downloaded', () => {
    if (splashWindow) {
      splashWindow.webContents.send('update-status', 'Update downloaded. Restarting...');
      setTimeout(() => {
        autoUpdater.quitAndInstall();
      }, 1000);
    }
  });
}

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

ipcMain.handle('check-for-updates', () => {
  if (autoUpdater) {
    autoUpdater.checkForUpdates();
    return { checking: true };
  } else {
    return { error: 'Auto updater not available' };
  }
});