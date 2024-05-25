import {useEffect, useState} from "react";
import LQ from "../../../../util/LQ.js";
import {useParams} from "react-router-dom";
import LightquarkChannel from "./LightquarkChannel.jsx";

export default function LightquarkChannelList() {
    const [channels, setChannels] = useState([])
    const {quarkId} = useParams();

    useEffect(() => {
        (async () => {
            setChannels([])
            const LQquark = (await LQ(`quark/${quarkId.split("lq_")[1]}`)).response.quark;
            setChannels(LQquark.channels)
        })()
    }, [quarkId])

    return <div>
        {channels.map((channel) => <LightquarkChannel channel={channel} quarkId={quarkId.split("lq_")[1]} key={channel._id} />)}
    </div>
}