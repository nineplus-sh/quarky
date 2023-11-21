import archiver from "archiver";
import {createWriteStream} from "fs";

const output = createWriteStream(new URL('../public/quarky.nya', import.meta.url));
const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
});

archive.pipe(output);
archive.directory(new URL('_nyafile', import.meta.url).pathname, false)
archive.finalize();