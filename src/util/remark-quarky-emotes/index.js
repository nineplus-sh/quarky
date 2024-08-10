import {findAndReplace} from "mdast-util-find-and-replace";
import {u} from "unist-builder";

const discordStatic = /(?:<|&lt;|&wt;):[a-zA-Z0-9_]+:(\d+)(?:>|&gt;)/g;
const discordAnimated = /(?:<|&lt;|&wt;)a:[a-zA-Z0-9_]+:(\d+)(?:>|&gt;)/g;
const discordStaticStrict = /^(?:(?:<|&lt;|&wt;):[a-zA-Z0-9_]+:(\d+)(?:>|&gt;))+$/g;
const discordAnimatedStrict = /^(?:(?:<|&lt;|&wt;)a:[a-zA-Z0-9_]+:(\d+)(?:>|&gt;))+$/g;

export default function remarkQuarkyEmotes(options) {
    return function (tree) {
        let size = 24
        if(tree.children.length === 1 && tree.children[0].children.length === 1 && tree.children[0].children[0].type === "text") {
            if(discordStaticStrict.test(tree.children[0].children[0].value) || discordAnimatedStrict.test(tree.children[0].children[0].value)) size = 48;
        }

        findAndReplace(tree, [[
            discordStatic,
            function(_whatever, id) {
                return u("image", {url: `https://cdn.discordapp.com/emojis/${id}.png?size=${size}`})
            }
        ], [
            discordAnimated,
            function(_whatever, id) {
                return u("image", {url: `https://cdn.discordapp.com/emojis/${id}.gif?size=${size}`})
            }
        ]])
    }
}