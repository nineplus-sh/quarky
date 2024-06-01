import Message from "../../../dialogs/Message.jsx";
import ProfilePicture from "../../../ProfilePicture.jsx";
import {useContext} from "react";
import {AppContext} from "../../../../contexts/AppContext.js";

export default function LightquarkMessage({message}) {
    const botMetadata = message.specialAttributes.find(attr => attr.type === "botMessage");
    const clientAttributes = message.specialAttributes.find(attr => attr.type === "clientAttributes");
    const {userCache} = useContext(AppContext);

    return <Message username={botMetadata?.username || userCache[message.author._id]?.username || message.author.username}
                    avatar={<ProfilePicture src={botMetadata?.avatarUri || userCache[message.author.id]?.avatarUri || message.author.avatarUri} isMessage={true}/>}
                    content={message.content} botName={botMetadata ? userCache[message.author._id]?.username || message.author.username : null} isDiscord={clientAttributes?.quarkcord}>
        {message.content}
    </Message>
}