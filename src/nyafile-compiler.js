const fs = require('fs');
const archiver = require('archiver');

const output = fs.createWriteStream(__dirname + '/../public/quarky.nya');
const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
});

archive.pipe(output);
archive.directory(__dirname + "/_nyafile", false)
archive.finalize();