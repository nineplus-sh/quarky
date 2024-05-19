const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('hiddenside', {
    hardcoreGaming: (games) => ipcRenderer.send('game-database-update', games),
    casualGaming: (callback) => ipcRenderer.on('detected-games', (_event, value) => callback(value))
})