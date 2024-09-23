import NyafileImage from "./nyafile/NyafileImage.jsx";

/**
 * 「日常に疲れたとき脱力する為のバナー」
 * 「脱力に乾杯という方は、使いたければご自由に持ってって貼ってくだされ。」
 * @returns {JSX.Element}
 */
export default function Datsuryoku() {
    return <a target={"_blank"} href="http://stormypetrel.sakura.ne.jp/daturyoku.htm" rel="noreferrer">
        <NyafileImage src={"img/daturyok"} />
    </a>
}