import styles from "./GIFPicker.module.css";
import {useEffect, useState} from "react";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry/lib/index.js";
import {useParams} from "react-router-dom";
import LQ from "../../util/LQ.js";

export default function GIFPicker({hide, ...props}) {
    let { dialogId } = useParams();
    const [search, setSearch] = useState("");
    const [gifs, setGIFs] = useState([]);

    useEffect(() => {
        async function searchyWearchy() {
            const gifs = await fetch(search ? `https://tenor.googleapis.com/v2/search?q=${search}&key=${import.meta.env.VITE_TENOR}&media_filter=gif,tinygif` : `https://tenor.googleapis.com/v2/featured?key=${import.meta.env.VITE_TENOR}&media_filter=gif,tinygif`).then((res) => res.json());
            setGIFs(gifs.results);
        }searchyWearchy();
    }, [search]);

     function sendGIF(url) {
        hide();
        const formData = new FormData();
        formData.append("payload", JSON.stringify({content: url}));
        LQ(`channel/${dialogId}/messages`, "POST", formData)
    }

    return <div className={styles.gifpickwrap} {...props}>
        <div className={styles.searchArea}>
            <input className={styles.searchbar} placeholder="Search Tenor" type="text"
                   value={search} onChange={e => setSearch(e.target.value)}/>
            <button type="button" onClick={() => window.open("https://tenor.com/gif-maker", "_blank")}>Upload</button>
        </div>

        <ResponsiveMasonry columnsCountBreakPoints={{0: 1, 1300: 2}}>
            <Masonry className={styles.gifs} gutter="10px">
                {gifs.map((gif) => <img src={gif.media_formats.tinygif.url} onClick={() => sendGIF(gif.itemurl)}
                                        width={gif.media_formats.tinygif.dims[0]} height={gif.media_formats.tinygif.dims[1]} key={gif.id}/>)}
            </Masonry>
        </ResponsiveMasonry>
    </div>
}