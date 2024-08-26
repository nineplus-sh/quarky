import {useQuery} from "@tanstack/react-query";
import styles from "./LightquarkEmoteSearch.module.css"
import Fuse from "fuse.js";
import useQuark from "../../../../util/useQuark.js";
import ProfilePicture from "../../../dialogs/ProfilePicture.jsx";

export default function LightquarkEmoteSearch({message, setMessage, floatRef, floatStyles, floatProps, activeIndex, listRef, itemProps}) {
    const { status, data, error, isLoading } = useQuery({queryKey: ['emoji']});
    const search = message.match(/:(\w{2,})$/);

    if(isLoading || !search) return null;
    const fuse = new Fuse(data?.emotes.flatMap(q => q.emotes), {keys:['name'],threshold:0.1});
    return <div className={styles.emoteSearchWrap} ref={floatRef} style={floatStyles} {...floatProps}>
        {fuse.search(search[1], {limit: 50}).map((emote, index) =>
            <LightquarkEmote key={emote.item._id} tabIndex={activeIndex === index ? 0 : -1} myRef={(node) => {
                listRef.current[index] = node;
            }} emoteProps={itemProps} emote={emote.item} onClick={() => setMessage(message.replace(search[0], `<${emote.item.name}:${emote.item._id}>`))}/>
        )}
    </div>
}

export function LightquarkEmote({emote, tabIndex, myRef, emoteProps, onClick}) {
    const {data, isLoading} = useQuark(emote.quark);

    return <div className={styles.emoteWrap} tabIndex={tabIndex} onClick={onClick} ref={myRef} {...emoteProps}>
        <img className={styles.emote} src={emote.imageUri}/>
        <span className={styles.emoteMetadata}>
            <span className={styles.emoteName}>:{emote.name}:</span>
            {isLoading ? null : <span className={styles.emoteQuark}>
                <img src={data.iconUri} width={16} height={16}/>
                <span>{data.name}</span>
            </span>}
        </span>
    </div>
}