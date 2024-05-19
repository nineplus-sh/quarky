import psList from "@667/ps-list";
import { parentPort } from "worker_threads";

async function gameCheck(database) {
    const processList = await psList();
    const games = database.filter(game => game.executables.some(executable => processList.some(process => process.cmd.toLowerCase().includes(executable.name)))); // TODO: DO NOT DO THIS

    return games;
}

parentPort.on('message', async (database) => {
    parentPort.postMessage(await gameCheck(database));
})