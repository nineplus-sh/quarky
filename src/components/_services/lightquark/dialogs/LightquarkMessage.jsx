import Message from "../../../dialogs/Message.jsx";
import {memo, useContext} from "react";
import {AppContext} from "../../../../contexts/AppContext.js";
import LightquarkAttachments from "./LightquarkAttachments.jsx";
import GameInvite from "../../../dialogs/GameInvite.jsx";
import LQ from "../../../../util/LQ.js";
import useRPC from "../hooks/useRPC.js";
import useUser from "../hooks/useUser.js";
import useChannelMessageEdit from "../hooks/useChannelMessageEdit.js";
import useChannelMessageDelete from "../hooks/useChannelMessageDelete.js";

export default memo(function LightquarkMessage({message, channel, quark, isContinuation, isAuthored}) {
    const apiCall = useRPC();
    const messageEdit = useChannelMessageEdit();
    const messageDelete = useChannelMessageDelete();
    const {isSuccess: authorReady, data: noBotAuthor} = useUser(message.author);

    if(!authorReady) return <Message username={"Loading..."} content={message.content}/>

    const botMetadata = message.specialAttributes?.find(attr => attr.type === "botMessage");
    const clientAttributes = message.specialAttributes?.find(attr => attr.type === "clientAttributes");
    let gameData;
    if(clientAttributes?.game) gameData = JSON.parse(clientAttributes?.game);

    const author = botMetadata || noBotAuthor;

    return <Message username={author.username} timestamp={message.timestamp} edited={message.edited} attachments={<LightquarkAttachments attachments={message.attachments}/>}
                    avatarUri={author.avatarUri} content={message.content} isBot={noBotAuthor.isBot} botName={botMetadata ? noBotAuthor.username : null}
                    isDiscord={clientAttributes?.quarkcord} isContinuation={isContinuation}
                    game={gameData ? <GameInvite {...gameData} opponent={{name: author.username, avatar: author.avatarUri, score: gameData.score}} arena={{id: quark}}/> : null}
                    mutatorIsBusy={messageEdit.isLoading || messageDelete.isLoading} mutatorError={messageEdit.error || messageDelete.error}

                    editFunction={isAuthored ? async (content) => {await messageEdit.mutate({
                        channel, messageID: message._id, message: {content}
                    })} : undefined}
                    deleteFunction={isAuthored ? async () => await messageDelete.mutate({channel, messageID: message._id}) : undefined}/>
})