import archiver from "archiver";
import {createWriteStream} from "fs";
import {dirname, resolve} from "path";
import {fileURLToPath} from "url";

const __dirname = fileURLToPath(dirname(import.meta.url));


const output = createWriteStream(resolve(__dirname, '../public/quarky.nya'));
const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
});

archive.pipe(output);
archive.directory(resolve(__dirname, '_nyafile'), false)
archive.finalize();