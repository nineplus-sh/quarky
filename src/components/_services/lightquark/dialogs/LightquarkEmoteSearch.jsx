import {useQuery} from "@tanstack/react-query";
import styles from "./LightquarkEmoteSearch.module.css"
import Fuse from "fuse.js";
import useQuark from "../hooks/useQuark.js";
import {useContext, useEffect} from "react";
import {AppContext} from "../../../../contexts/AppContext.js";
import useRPC from "../hooks/useRPC.js";

export default function LightquarkEmoteSearch({message, setMessage, search, results, activeIndex, listRef, itemProps, ...props}) {
    if(!results) return null;
    if(results.length === 0) return <div className={styles.emoteSearchWrap} {...props}>
        <div className={styles.emoteWrap} aria-hidden={true}>¯\_(ツ)_/¯</div></div>;

    return <div className={styles.emoteSearchWrap} aria-label="listbox" {...props}>
        {results.map((emote, index) =>
            <LightquarkEmote key={emote.item._id} selected={activeIndex === index} ref={(node) => {
                listRef.current[index] = node; return listRef.current[index]
            }} emoteProps={itemProps} emote={emote.item} onClick={() => setMessage(message.replace(":" + search, `<${emote.item.name}:${emote.item._id}>`))}/>
        )}
    </div>
}

export function LightquarkEmote({emote, selected, ref, emoteProps, onClick}) {
    const {data, isLoading} = useQuark(emote.quark);

    return <div className={styles.emoteWrap} id={emote._id} aria-selected={selected} tabIndex={selected ? -1 : 0} ref={ref} {...emoteProps} onClick={onClick}>
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