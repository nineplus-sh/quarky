import {useQuery} from "@tanstack/react-query";
import styles from "./LightquarkEmoteSearch.module.css"
import Fuse from "fuse.js";
import useQuark from "../hooks/useQuark.js";
import {useContext, useEffect} from "react";
import {AppContext} from "../../../../contexts/AppContext.js";
import useRPC from "../hooks/useRPC.js";

export default function LightquarkEmoteSearch({message, setMessage, floatRef, floatStyles, floatProps, activeIndex, listRef, itemProps}) {
    const apiCall = useRPC();
    const { data, isLoading } = useQuery({
        queryKey: ['emoji'],
        queryFn: async function () {
            const data = await apiCall("emoji")
            return data.emotes;
        }
    });
    const {nyafile} = useContext(AppContext);
    const search = message.match(/:(\w{2,})$/);

    function enterHandler(event) {
        if (event.key === 'Enter') {
            listRef.current[activeIndex]?.click();
        }
    }
    useEffect(() => {
        if(activeIndex !== null) new Audio(nyafile.getCachedData("sfx/button-sidebar-hover")).play();
        document.addEventListener("keydown", enterHandler);
        return () => document.removeEventListener('keydown', enterHandler);
    }, [activeIndex]);

    if(isLoading) return <div className={styles.emoteSearchWrap} ref={floatRef} style={floatStyles} {...floatProps}>
        <div className={styles.emoteWrap} aria-hidden={true}> (╭ರ_•́)</div></div>;

    if(!search) return null;
    const fuse = new Fuse(data?.flatMap(q => q.emotes), {keys: ['name'], threshold: 0.1});
    const result = fuse.search(search[1], {limit: 50});

    if(result.length === 0) return <div className={styles.emoteSearchWrap} ref={floatRef} style={floatStyles} {...floatProps}>
        <div className={styles.emoteWrap} aria-hidden={true}>¯\_(ツ)_/¯</div></div>;

    return <div className={styles.emoteSearchWrap} aria-label="listbox" ref={floatRef} style={floatStyles} {...floatProps}>
        {result.map((emote, index) =>
            <LightquarkEmote key={emote.item._id} selected={activeIndex === index} myRef={(node) => {
                listRef.current[index] = node;
            }} emoteProps={itemProps} emote={emote.item} onClick={() => setMessage(message.replace(search[0], `<${emote.item.name}:${emote.item._id}>`))}/>
        )}
    </div>
}

export function LightquarkEmote({emote, selected, myRef, emoteProps, onClick}) {
    const {data, isLoading} = useQuark(emote.quark);

    return <div className={styles.emoteWrap} id={emote._id} aria-selected={selected} tabIndex={selected ? -1 : 0} ref={myRef} {...emoteProps} onClick={onClick}>
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