// noinspection all

import AdmZip from "adm-zip"

let zip = new AdmZip();

zip.addLocalFolder("src/_nyafile")

zip.writeZip("public/quarky.nya")

console.log(`Created quarky.nya successfully`);