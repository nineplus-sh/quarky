import NiceModal, {useModal} from "@ebay/nice-modal-react";
import GenericModal from "./GenericModal.jsx";
import {useState} from "react";
import GameModal from "./GameModal.jsx";

export default NiceModal.create(({quarkId}) =>{
    const modal = useModal();
    let [url, setUrl] = useState("");

    return <GenericModal modal={modal}>
        <p>Enter the URL to the game you want to test.</p>
        <form onSubmit={(e) => {
            e.preventDefault();
            modal.hide();
            NiceModal.show(GameModal, {gameLink: url, quarkId})
        }}>
                <input type={"text"} required value={url} onChange={e => setUrl(e.target.value)}/>
                <input type={"submit"}/>
        </form>
    </GenericModal>;
})