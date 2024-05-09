import Message from "../../../dialogs/Message.jsx";
import ProfilePicture from "../../../ProfilePicture.jsx";

export default function LightquarkMessage({message}) {
    const botMetadata = message.specialAttributes.find(attr => attr.type === "botMessage");

    return <Message username={botMetadata?.username || message.author.username}
                    avatar={<ProfilePicture src={botMetadata?.avatarUri || message.author.avatarUri}/>}
                    content={message.content}>
        {message.content}
    </Message>
}