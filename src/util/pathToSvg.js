const boilerplate = '<?xml version="1.0" encoding="utf-8"?><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 {!WIDTH!} {!HEIGHT!}" xml:space="preserve"><path d="{!PATH!}"/></svg>'
const lookup = 'AACAAAAHAAALMAAAQASTAVAAAZaacaaaahaaalmaaaqastava.az0123456789-,'

/**
 * https://core.telegram.org/api/files#vector-thumbnails
 * Converts a compressed vector thumbnail to an SVG.
 * @param bytes
 */
export default function pathToSvg(bytes) {
    return boilerplate
        .replace("{!PATH!}", inflator(bytes))
        .replace("{!WIDTH!}", "512")
        .replace("{!HEIGHT!}", "512")
}

function inflator(bytes) {
    let path = 'M';
    const len = bytes.length;

    for (let eye = 0; eye < len; eye++) {
        const num = bytes[eye];
        if (num >= 128 + 64) {
            path += lookup[num - 128 - 64]
        } else {
            if (num >= 128) {
                path += ','
            } else if (num >= 64) {
                path += '-'
            }
            path += String(num & 63)
        }
    }

    path += 'z';
    return path;
}