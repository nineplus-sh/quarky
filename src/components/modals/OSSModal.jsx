import OSSList from "../oss/OSSList.jsx";
import GenericModal from "./GenericModal.jsx";
import Datsuryoku from "../Datsuryoku.jsx";

/**
 * A wrapper around GenericModal for the open source library notices.
 * @param props - The props of the component, provided by React. Refer to GenericModal for the props.
 * @returns {JSX.Element}
 * @constructor
 */
export default function OSSModal(props) {
    return (<>
        <GenericModal {...props}>
            <Datsuryoku />
            <p>Quarky uses music by <a href={"https://www.hurtrecord.com/"}>HURT RECORD</a> and sound effects from <a href={"https://github.com/ppy/osu-resources"}>osu!resources</a>. Quarky also uses open source libraries:</p>
            <OSSList />
        </GenericModal>
    </>)
}