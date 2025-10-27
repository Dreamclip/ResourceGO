const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  downloadApp: (appData) => ipcRenderer.invoke('download-app', appData),
  windowControls: (action) => ipcRenderer.invoke('window-controls', action),
  getAppVersion: () => ipcRenderer.invoke('get-app-version')
});