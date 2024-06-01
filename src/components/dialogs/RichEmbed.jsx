import {useEffect, useRef, useState} from "react";
import styles from "./RichEmbed.module.css";

export default function RichEmbed({url}) {
    const [embedHeight, setEmbedHeight] = useState(0);
    const ourFrame = useRef(null);
    useEffect(() => {
        const iframeEventHandler = (estrogen) => {
            if(ourFrame?.current?.contentWindow !== estrogen.source) return;
            if(estrogen.origin === "https://embed.tumblr.com") {
                if(estrogen.data.type === "embed-size") {
                    return setEmbedHeight(estrogen.data.height);
                }
                if(estrogen.data.startsWith('{"method":"tumblr-post:sizeChange"')) {
                    return setEmbedHeight(JSON.parse(estrogen.data).args[0]);
                }
            } else if (estrogen.origin === "https://platform.twitter.com") {
                if(estrogen.data["twttr.embed"].method === "twttr.private.resize") {
                    return setEmbedHeight(estrogen.data["twttr.embed"].params[0].height);
                }
            }
        }

        window.addEventListener('message', iframeEventHandler)
        return () => window.removeEventListener('message', iframeEventHandler)
    }, [])

    if(!url.startsWith('http')) return;

    const urlWrap = new URL(url);

    let tumblr;
    if(!tumblr) tumblr = urlWrap.href.match(/https?:\/\/(.*)\.tumblr\.com\/post\/(\d*)/);
    if(!tumblr) tumblr = urlWrap.href.match(/https?:\/\/www\.tumblr\.com\/(.*)\/(\d*)/)
    if(tumblr) {
        return <div className={styles.wrapblr}><iframe src={`https://embed.tumblr.com/embed/post/${tumblr[1]}/${tumblr[2]}`} ref={ourFrame} height={embedHeight} className={styles.richEmbed}/></div>
    }

    let steamStore = urlWrap.href.match(/https?:\/\/store\.steampowered\.com\/app\/(\d*)/)
    if(steamStore) {
        return <div className={styles.richEmbedWrap}><iframe className={styles.richEmbed} height={195} src={`https://store.steampowered.com/widget/${steamStore[1]}/?utm_source=quarky`}/></div>
    }

    let soundcloud = /https?:\/\/soundcloud\.com\/\w{3,25}\/\w+/.test(urlWrap.href)
    if(soundcloud) {
        return <div className={styles.richEmbedWrap}><iframe className={styles.richEmbed} height={166} src={`https://w.soundcloud.com/player/?url=${urlWrap.href}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=true&show_user=true&show_reposts=true&show_teaser=false`}/></div>
    }

    let spotify = urlWrap.href.match(/https?:\/\/open\.spotify\.com\/track\/(\w+)/)
    if(spotify) {
        return <div className={styles.richEmbedWrap}><iframe className={styles.richEmbed} height={80} src={`https://open.spotify.com/embed/track/${spotify[1]}`}/></div>
    }

    let tweet = urlWrap.href.match(/https?:\/\/(?:x|twitter|fixupx|fxtwitter|vxtwitter|twittpr|fixvx)\.com\/\w+\/status\/(\d+)/)
    if(tweet) { // TODO: "theme" query parameter can be light or dark
        return <div className={styles.richEmbedWrap}><iframe src={`https://platform.twitter.com/embed/Tweet.html?dnt=true&id=${tweet[1]}`} ref={ourFrame} height={embedHeight} className={styles.richEmbed} /></div>
    }
}