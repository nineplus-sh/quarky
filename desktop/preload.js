const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('hiddenside', {
    platform: process.platform,
    hardcoreGaming: (games) => ipcRenderer.send('game-database-update', games),
    casualGaming: (callback) => ipcRenderer.on('detected-games', (_event, value) => callback(value)),
    birthOfGaming: () => ipcRenderer.send('get-all-processes'),
    babyGaming: (callback) => ipcRenderer.on('detected-processes', (_event, value) => callback(value)),
    byeBaby: (callback) => ipcRenderer.removeListener('detected-processes', callback)
})