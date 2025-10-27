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
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  splashWindow.loadFile('splash.html');
  
  // Force show the splash window
  splashWindow.show();
  
  // Проверяем обновления если доступно
  if (autoUpdater) {
    // Настраиваем для dev режима
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = true;
    
    autoUpdater.checkForUpdatesAndNotify().then(() => {
      // Когда проверка завершена (даже если нет обновлений), запускаем основное приложение
      setTimeout(() => {
        launchMainApp();
      }, 1500);
    }).catch(error => {
      console.log('Update check failed:', error);
      // В случае ошибки все равно запускаем приложение
      setTimeout(() => {
        launchMainApp();
      }, 1500);
    });
  } else {
    // Fallback: симулируем проверку
    setTimeout(() => {
      launchMainApp();
    }, 2500);
  }
}

function launchMainApp() {
  if (splashWindow) {
    splashWindow.webContents.send('update-status', 'Launching application...');
    setTimeout(() => {
      if (splashWindow && !splashWindow.isDestroyed()) {
        splashWindow.close();
        splashWindow = null;
      }
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.show();
        mainWindow.focus();
      }
    }, 800);
  }
}

function createMainWindow() {
  // Рассчитываем размеры с учетом title bar
  const { screen } = require('electron');
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  
  const windowWidth = Math.min(1200, width - 100);
  const windowHeight = Math.min(800, height - 100);

  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    minWidth: 900,
    minHeight: 650, // Увеличил минимальную высоту
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    backgroundColor: '#000000',
    frame: false,
    titleBarStyle: 'hidden',
    show: false,
    titleBarOverlay: {
      color: '#000000',
      symbolColor: '#ffffff',
      height: 32
    }
  });

  mainWindow.loadFile('index.html');
  
  // Центрируем окно
  mainWindow.center();
  
  // Обработчик изменения размера
  mainWindow.on('resize', () => {
    // Можно добавить логику адаптации при изменении размера
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Auto Updater events
if (autoUpdater) {
  autoUpdater.on('update-available', () => {
    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.webContents.send('update-status', 'Update available. Downloading...');
    }
    // Автоматически начинаем скачивание
    autoUpdater.downloadUpdate();
  });

  autoUpdater.on('update-not-available', () => {
    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.webContents.send('update-status', 'No updates available. Launching...');
    }
  });

  autoUpdater.on('download-progress', (progressObj) => {
    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.webContents.send('download-progress', progressObj.percent);
    }
  });

  autoUpdater.on('update-downloaded', () => {
    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.webContents.send('update-status', 'Update downloaded! Restarting...');
      setTimeout(() => {
        autoUpdater.quitAndInstall();
      }, 1000);
    }
  });

  autoUpdater.on('error', (error) => {
    console.log('Updater error:', error);
    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.webContents.send('update-status', 'Update check failed. Launching...');
    }
    // Все равно запускаем приложение при ошибке
    setTimeout(() => {
      launchMainApp();
    }, 1500);
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