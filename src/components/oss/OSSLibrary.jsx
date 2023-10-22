/**
 * Information about an open source library, to be used in OSSList.
 * @param {string} name - The name of the library.
 * @param {string} license - The license of the library.
 * @param {string} description - The description of the library.
 * @param {string} copyright - The copyright line of the library.
 * @returns {JSX.Element}
 * @constructor
 */
export default function OSSLibrary({name, license, description, copyright}) {
    const url = `https://npmjs.com/package/${name.startsWith("@") ? "@" + name.split("@")[1] : name.split("@")[0]}`
    return (<>
        <p><a href={url} target={"_blank"} rel={"noreferrer"}>
            <b>{name}</b>
        </a> - {license}<br/><i>{description}</i><br/>{copyright}</p>
    </>)
}