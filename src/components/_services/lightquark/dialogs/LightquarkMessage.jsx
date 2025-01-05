import Message from "../../../dialogs/Message.jsx";
import {memo, useContext} from "react";
import {AppContext} from "../../../../contexts/AppContext.js";
import LightquarkAttachments from "./LightquarkAttachments.jsx";
import GameInvite from "../../../dialogs/GameInvite.jsx";
import LQ from "../../../../util/LQ.js";
import useRPC from "../hooks/useRPC.js";
import useUser from "../hooks/useUser.js";

export default memo(function LightquarkMessage({message, channel, quark, isContinuation, isAuthored}) {
    const apiCall = useRPC();
    const {isSuccess: authorReady, data: noBotAuthor} = useUser(message.author);

    if(!authorReady) return <Message username={"Loading..."} content={message.content}/>

    const botMetadata = message.specialAttributes?.find(attr => attr.type === "botMessage");
    const clientAttributes = message.specialAttributes?.find(attr => attr.type === "clientAttributes");
    let gameData;
    if(clientAttributes?.game) gameData = JSON.parse(clientAttributes?.game);

    const author = botMetadata || noBotAuthor;

    async function editMessage(content) {
        const formData = new FormData();
        formData.append("payload", JSON.stringify({content}));
        await LQ(`channel/${channel}/messages/${message._id}`, "PATCH", formData);
    }

    return <Message username={author.username} timestamp={message.timestamp} edited={message.edited} attachments={<LightquarkAttachments attachments={message.attachments}/>}
                    avatarUri={author.avatarUri} content={message.content} isBot={noBotAuthor.isBot} botName={botMetadata ? noBotAuthor.username : null}
                    isDiscord={clientAttributes?.quarkcord} isContinuation={isContinuation}
                    game={gameData ? <GameInvite {...gameData} opponent={{name: author.username, avatar: author.avatarUri, score: gameData.score}} arena={{id: quark}}/> : null}
                    editFunction={isAuthored ? async (content) => await editMessage(content) : undefined} deleteFunction={isAuthored ? async () => {
                        await apiCall({
                            route: `channel/${channel}/messages/${message._id}`,
                            method: "DELETE"
                        })
                    } : undefined}/>
})