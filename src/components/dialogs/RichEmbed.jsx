export default function RichEmbed({url}) {
    if(!url.startsWith('http')) return;

    const urlWrap = new URL(url);
    switch (urlWrap.hostname) {
        case "reddit.com":
        case "www.reddit.com":
        case "old.reddit.com":
        case "new.reddit.com":
        case "sh.reddit.com":
        case "embed.reddit.com":
            if(
                /^(https?:\/\/(\w+\.|)reddit\.com)\/(?:r|u|user)\/\w+\/comments\/\w+\/?([^/]*?)(\/?|\/\w*\/?)(\?.*)?$/.test(url) ||
                /^(https?:\/\/(\w+\.|)reddit\.com)\/r\/\w+\/?(\?.*)?$/.test(url)
            ) {
                urlWrap.hostname = "embed.reddit.com";
                return <iframe src={urlWrap.href}/>
            } else {
                return null;
            }
        default:
            return null;
    }
}