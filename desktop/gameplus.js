import psList from "@667/ps-list";
import {parentPort} from "worker_threads";
import {exec} from "child_process";

const getPowershell = 'powershell.exe -NoLogo -NoProfile -Command "Get-CimInstance Win32_Process | Select-Object Name, ExecutablePath, CommandLine | ConvertTo-Json"';

async function getProcesses() {
    if(process.platform === "win32") {
        return new Promise((resolve, reject) => {
            exec(getPowershell, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (stderr) {
                    reject(stderr);
                    return;
                }
                const processes = JSON.parse(stdout).map(process => {
                    return {
                        // name: process.Name,
                        name: process.ExecutablePath?.replace(/\\/g, '/') || process.Name,
                        cmd: process.CommandLine?.replace(/\\/g, '/')
                    };
                });
                resolve(processes);
            });
        });
    } else {
        return psList();
    }
}

function checkLambda(executable, process) {
    return process.cmd.toLowerCase().replace(/\\/g, '/').includes(`/${executable.name}`) && process.cmd.includes(executable.arguments)
}

let processBlacklist = [];
async function gameCheck(database) {
    let processList = await getProcesses();
    // console.debug(`Got ${processList.length} processes`)
    processList = processList.filter(p => !processBlacklist.includes(p.cmd)) // Remove blacklisted processes
    // console.debug(`${processList.length} potential games`)
    let games = [];
    let gameProcesses = []
    database.forEach(game => {
        const isRunning = processList.some(p => {
            const isGame = game.executables.some(e => {
                return checkLambda(e, p)
            })
            if (isGame) {
                gameProcesses.push(p.cmd)
            }
            return isGame;
        })
        if (isRunning) {
            games.push(game)
        }
    })
    processList.forEach(p => {
        const isGame = gameProcesses.includes(p.cmd)
        if (isGame) {
            // console.debug(`${p.name} is a game`)
        }
        else if (!processBlacklist.includes(p.cmd)) {
            processBlacklist.push(p.cmd)
        }
    })
    // console.debug(games)
    return games;
    /* TODO
    This is a very barebones proof of concept implementation.
    Ideas for expansion:

    - Make use of the platform property
    - Add a way to prioritize games with arguments over those without, and those with more specific paths over those without
    - Allow executables running under Wine to be treated as standard win32 executables
     */
}

parentPort.on('message', async (message) => {
    if(message.type === "database") parentPort.postMessage({
        type: "detectedGames",
        data: await gameCheck(message.data)
    });
    if(message.type === "feedProcesses") parentPort.postMessage({
        type: "allProcesses",
        data: await getProcesses()
    })
})