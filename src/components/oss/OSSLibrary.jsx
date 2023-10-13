/**
 * Information about an open source library, to be used in OSSList.
 * @param {string} name - The name of the library.
 * @param {string} license - The license of the library.
 * @returns {JSX.Element}
 * @constructor
 */
export default function OSSLibrary({name, license}) {
    const url = `https://npmjs.com/package/${name.startsWith("@") ? "@" + name.split("@")[1] : name.split("@")[0]}`
    return (<>
        <a href={url} target={"_blank"}>
            <p><b>{name}</b><br/>{license}</p>
        </a>
    </>)
}