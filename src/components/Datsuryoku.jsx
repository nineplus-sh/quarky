import {AppContext} from "../contexts/AppContext.js";
import {useContext} from "react";
import { useFlag } from '@unleash/proxy-client-react';

/**
 * 「日常に疲れたとき脱力する為のバナー」
 * 「脱力に乾杯という方は、使いたければご自由に持ってって貼ってくだされ。」
 * @returns {JSX.Element}
 * @constructor
 */
export default function Datsuryoku() {
    const appContext = useContext(AppContext);
    const useDirectLink = useFlag('Q2_DatsuryokuLink');
    return <a href={useDirectLink ? "http://stormypetrel.sakura.ne.jp/daturyoku.htm" : "https://web.archive.org/web/20231119170958/http://stormypetrel.sakura.ne.jp/daturyoku.htm"}>
        <img src={appContext.nyafile.getCachedData("img/daturyok")} />
    </a>
}