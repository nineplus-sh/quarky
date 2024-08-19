import {useQuery} from "@tanstack/react-query";
import styles from "./LightquarkEmoteSearch.module.css"
import Fuse from "fuse.js";

export default function LightquarkEmoteSearch({message, setMessage, floatRef, floatStyles}) {
    const { status, data, error, isLoading } = useQuery({queryKey: ['emoji']});
    const search = message.match(/:(\w{2,})$/);

    if(isLoading || !search) return null;
    const fuse = new Fuse(data?.emotes.flatMap(q => q.emotes), {keys:['name'],threshold:0.1});
    return <div className={styles.emoteSearchWrap} ref={floatRef} style={floatStyles}>
        {fuse.search(search[1], {limit: 50}).map(emote =>
            <div className={styles.emoteWrap} key={emote.item._id} onClick={() => setMessage(message.replace(search[0], `<${emote.item.name}:${emote.item._id}>`))}>
                <img className={styles.emote} src={emote.item.imageUri}/> {emote.item.name}
            </div>
        )}
    </div>
}