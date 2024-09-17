import { useFlag } from '@unleash/proxy-client-react';
import NyafileImage from "./nyafile/NyafileImage.jsx";

/**
 * 「日常に疲れたとき脱力する為のバナー」
 * 「脱力に乾杯という方は、使いたければご自由に持ってって貼ってくだされ。」
 * @returns {JSX.Element}
 */
export default function Datsuryoku() {
    const useDirectLink = useFlag('Q2_DatsuryokuLink');
    return <a target={"_blank"} href={useDirectLink ? "http://stormypetrel.sakura.ne.jp/daturyoku.htm" : "https://web.archive.org/web/20231119170958/http://stormypetrel.sakura.ne.jp/daturyoku.htm"} rel="noreferrer">
        <NyafileImage src={"img/daturyok"} />
    </a>
}