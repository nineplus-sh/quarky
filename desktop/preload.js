const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('hiddenside', {
    platform: process.platform,
    hardcoreGaming: (games) => ipcRenderer.send('game-database-update', games),
    casualGaming: (callback) => createListener('detected-games', callback),
    birthOfGaming: () => ipcRenderer.send('get-all-processes'),
    babyGaming: (callback) => createListener('detected-processes', callback),
})

function createListener(channel, callback) {
    const trueCB = (event, ...args) => callback(...args);
    ipcRenderer.on(channel, trueCB)
    return () => ipcRenderer.removeListener(channel, trueCB);
}