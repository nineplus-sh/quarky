// https://stackoverflow.com/a/69047683
export default function dedupe(arr, keyProp) {
    return [...arr
        .reduce((acc, obj) =>
            (acc.set(obj[keyProp], obj), acc), new Map)
        .values()]
}