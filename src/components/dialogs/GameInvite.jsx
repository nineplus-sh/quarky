import GameModal from "../modals/GameModal.jsx";
import NiceModal from "@ebay/nice-modal-react";

export default function GameInvite({name, score, url, opponent, arena}) {
    return <p>I got {score} in {name}! <button onClick={() => NiceModal.show(GameModal, {
        gameLink: url,
        opponent: opponent,
        arena: arena
    })}>Play</button></p>
}