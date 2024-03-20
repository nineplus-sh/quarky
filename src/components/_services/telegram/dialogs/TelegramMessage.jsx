import TelegramProfilePicture from "../TelegramProfilePicture.jsx";
import TelegramSticker from "./TelegramSticker.jsx";
import Message from "../../../dialogs/Message.jsx";
import TelegramPhoto from "./TelegramPhoto.jsx";

export default function TelegramMessage({message}) {
    if(
        !message.action &&
        (!message.media || message.media.className === "MessageMediaWebPage")
    ) {
        return <Message username={message._sender.firstName || message.postAuthor}
                        avatar={<TelegramProfilePicture photo={message._sender.photo} peer={message._inputSender}/>}
                        content={message.message}>
            {message.message}
        </Message>
    } else if (
        message.media &&
        message.media.className === "MessageMediaDocument" &&
        message.media.document.attributes.find(attribute => attribute.className === "DocumentAttributeSticker")
    ) {
        return <Message username={message._sender.firstName || message.postAuthor}
                        avatar={<TelegramProfilePicture photo={message._sender.photo} peer={message._inputSender}/>}
                        content={""}>
            <TelegramSticker media={message.media.document}/>
        </Message>
    } else if (
        message.media &&
        message.media.className === "MessageMediaPhoto"
    ) {
        return <Message username={message._sender.firstName || message.postAuthor}
                        avatar={<TelegramProfilePicture photo={message._sender.photo} peer={message._inputSender}/>}
                        content={message.message}>
            <TelegramPhoto media={message.media}/>
            {message.message}
        </Message>
    } else {
        return <Message content={""}>
            <i>This version of Quarky does not support this message type.</i>
        </Message>
    }
}