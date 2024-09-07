import mainViewStyles from "./MainView.module.css";
import quarkViewStyles from "./QuarkView.module.css";
import GenericQuark from "../components/nav/GenericQuark.jsx";
import QuarkHeader from "../components/_services/lightquark/nav/QuarkHeader.jsx";
import LightquarkChannelList from "../components/_services/lightquark/nav/LightquarkChannelList.jsx";
import Aviebox from "../components/_services/lightquark/nav/Aviebox.jsx";

export default function DemoView() {
    return <>
        <div className={mainViewStyles.quarkList}>
            <GenericQuark/>
        </div>
        <div className={quarkViewStyles.quarkView}>
            <div className={quarkViewStyles.channelListWrap}>
                <QuarkHeader interaction={false} quark={{
                    name: "World's realest quark :)"
                }}/>
                <LightquarkChannelList quark={{
                    _id: "1",
                    channels: [{
                        _id: "2",
                        name: "Rub my tummy!"
                    }]
                }}/>
                <Aviebox interaction={false} user={{
                    avatarUri: "https://google.com",
                    username: "You!"
                }}/>
            </div>
        </div>
    </>
}