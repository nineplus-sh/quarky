import {app, BrowserWindow, autoUpdater, dialog, nativeImage, shell, ipcMain} from "electron";
import electron_squirrel_startup from "electron-squirrel-startup/index.js";
import { Worker } from "worker_threads";
if (electron_squirrel_startup) app.quit();

import isDev from 'electron-is-dev';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import os from "node:os";
import * as path from "node:path";
import installExtension, {REACT_DEVELOPER_TOOLS} from "@tomjs/electron-devtools-installer";
const __dirname = fileURLToPath(dirname(import.meta.url));
const gamePLUS = new Worker(path.join(__dirname, 'gameplus.js'));

const hazel = "https://roald.hakase.life";
let gameDatabase = null;
const tumblrRegex = /https:\/\/www\.tumblr\.com(?:\/reblog\/(\w+)\/\d+\/[a-zA-Z0-9-]+\?source=embed|\/(\w+)\/\d+(?:\/[a-zA-Z0-9-]+|)\?source=embed&action=like)/

if (isDev) {
    app.commandLine.appendSwitch('ignore-certificate-errors')
    app.commandLine.appendSwitch('allow-insecure-localhost', 'true');
} else {
    autoUpdater.setFeedURL({ url: `${hazel}/update/${process.platform}/${app.getVersion()}` })
    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
        const dialogOpts = {
            type: 'info',
            buttons: ['Update!', 'Remind me next time'],
            title: 'Who wants a Quarky Desktop update?~ Youuuuuu! :3',
            message: "Quarky Desktop has a new update available!",
            detail: 'And it\'s already downloaded - just click update below to restart!',
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
        const logins = [
            "https://accounts.spotify.com/login",
            "https://www.tumblr.com/login",
            "https://accounts.google.com/ServiceLogin?service=youtube&continue=https://www.youtube.com/signin?action_handle_signin=true"
        ]
        if(logins.includes(url) || tumblrRegex.test(url)) {
            return { action: 'allow' }
        } else {
            shell.openExternal(url);
            return { action: 'deny' };
        }
    });
    win.webContents.on('did-create-window', (childWindow) => {
        childWindow.setSize(500,600);
        childWindow.setMenuBarVisibility(false);

        const successes = [
            "https://www.tumblr.com/dashboard",
            "https://www.youtube.com/"
        ]
        childWindow.webContents.on('did-start-navigation', (event, newUrl) => {
            console.log("DSN", newUrl)
            if (successes.includes(newUrl)) {
                childWindow.close();
            }
        });
        childWindow.webContents.on('did-navigate', (event, newUrl) => {
            console.log("DN", newUrl)
            if (successes.includes(newUrl)) {
                childWindow.close();
                dialog.showMessageBox({message: "Signed in successfully!"})
            }
        });
        childWindow.webContents.on('will-prevent-unload', event => {
            childWindow.destroy();
        })
        childWindow.webContents.on('did-finish-load', () => {
            const currentURL = childWindow.webContents.getURL();
            const rebloggingFrom = currentURL.match(tumblrRegex);
            console.log(rebloggingFrom)
            if(rebloggingFrom) {
                childWindow.setTitle(`Tumblr: Reblogging from ${rebloggingFrom[1] || rebloggingFrom[2]}`);
                childWindow.setIcon(nativeImage.createFromPath(__dirname + `/resources/tumblr.png`))
            }
        });
    });
    win.setMenuBarVisibility(false);

    if (!isDev) {
        autoUpdater.checkForUpdates();
        setInterval(() => {
            autoUpdater.checkForUpdates();
        }, 60000)
    } else {
        installExtension([REACT_DEVELOPER_TOOLS])
    }

    win.loadURL(
        isDev
            ? 'https://localhost:2009'
            :  'https://quarky.nineplus.sh'
    );

    gamePLUS.on('message', (message) => {
        if(message.type === "detectedGames") win.webContents.send("detected-games", message.data);
        if(message.type === "allProcesses") win.webContents.send("detected-processes", message.data);
    })
    setInterval(function() {
        if(!gameDatabase) return;
        gamePLUS.postMessage({type: "database", data: gameDatabase});
    }, 1000)
}

app.whenReady().then(() => {
    ipcMain.on('game-database-update', (event, database) => gameDatabase = database);
    ipcMain.on('get-all-processes', () => gamePLUS.postMessage({type: "feedProcesses"}));
    createWindow()
})