import {app, BrowserWindow, autoUpdater, dialog, nativeImage, shell, ipcMain} from "electron";
import electron_squirrel_startup from "electron-squirrel-startup/index.js";
import { Worker } from "worker_threads";
if (electron_squirrel_startup) app.quit();

import isDev from 'electron-is-dev/index.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import os from "node:os";
import * as path from "node:path";
const __dirname = fileURLToPath(dirname(import.meta.url));

const hazel = "https://roald.hakase.life";
let gameDatabase = null;

if (isDev) {
    app.commandLine.appendSwitch('ignore-certificate-errors')
    app.commandLine.appendSwitch('allow-insecure-localhost', 'true');
} else {
    autoUpdater.setFeedURL({ url: `${hazel}/update/${process.platform}/${app.getVersion()}` })
    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
        const dialogOpts = {
            type: 'info',
            buttons: ['Update!', 'Remind me next time'],
            title: 'Fresh Quarky Desktop for you~!',
            message: "A new version of Quarky Desktop is available!",
            detail: 'The update has been downloaded. Restart Quarky Desktop to apply the update.',
            icon: nativeImage.createFromPath(__dirname + "/resources/update.png")
        }
        dialog.showMessageBox(dialogOpts).then((returnValue) => {
            if (returnValue.response === 0) autoUpdater.quitAndInstall()
        })
    })
}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: nativeImage.createFromPath(__dirname + `/resources/quarky.${os.platform() === "win32" ? "ico" : "png"}`),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });
    win.setMenuBarVisibility(false)

    if (!isDev) {
        autoUpdater.checkForUpdates();
        setInterval(() => {
            autoUpdater.checkForUpdates();
        }, 60000)
    }

    win.loadURL(
        isDev
            ? 'https://localhost:2009'
            :  'https://quarky.nineplus.sh'
    );

    const gamePLUS = new Worker(path.join(__dirname, 'gameplus.js'));
    gamePLUS.on('message', (games) => {
        win.webContents.send("detected-games", games);
    })
    setInterval(function() {
        if(!gameDatabase) return;
        gamePLUS.postMessage(gameDatabase);
    }, 1000)
}

app.whenReady().then(() => {
    ipcMain.on('game-database-update', (event, database) => gameDatabase = database);
    createWindow()
})