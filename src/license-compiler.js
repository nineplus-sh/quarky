import * as licenseChecker from "license-checker";
// https://github.com/nodejs/node/issues/28114#issuecomment-894422124
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { writeFileSync } from 'fs';
const __dirname = fileURLToPath(dirname(import.meta.url));

licenseChecker.init({
    start: __dirname + "/..",
    production: true,
    customFormat: {
        repository: false,
        email: false,
        url: false,
        path: false,
        licenseFile: false,
        licenseText: false,
        description: true
    }
}, function(err, packages) {
    writeFileSync(__dirname + "/_nyafile/data/licenses.json", JSON.stringify(packages))
})