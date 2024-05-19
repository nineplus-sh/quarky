import psList from "@667/ps-list";
import {parentPort} from "worker_threads";
import {exec} from "child_process";

const getPowershell = 'powershell.exe -Command "Get-CimInstance Win32_Process | Select-Object Name, ExecutablePath, CommandLine | ConvertTo-Json"';

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
                        name: process.Name,
                        path: process.ExecutablePath?.replace(/\\/g, '/'),
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

async function gameCheck(database) {
    const processList = await getProcesses();
    const games = database.filter(game => game.executables.some(executable => processList.some(process => process.name.toLowerCase() === executable.name))); // TODO: DO NOT DO THIS

    return games;
}

parentPort.on('message', async (database) => {
    parentPort.postMessage(await gameCheck(database));
})