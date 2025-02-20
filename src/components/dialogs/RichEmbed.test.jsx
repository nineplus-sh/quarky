import {screen, render} from "@testing-library/react";
import RichEmbed from "./RichEmbed.jsx";

describe("Lichess games", () => {
    const expected = {
        title: "Embedded Lichess game"
    };

    test("render", () => {
        render(<RichEmbed url="https://lichess.org/bit1FDAk" />)
        expect(new URL(screen.getByTitle(expected.title).src)).toEqual(new URL("https://lichess.org/embed/game/bit1FDAk?pieceSet=horsey&theme=canvas"))
    })
    test("render with movestamp", () => {
        render(<RichEmbed url="https://lichess.org/bit1FDAk#105" />)
        expect(new URL(screen.getByTitle(expected.title).src)).toEqual(new URL("https://lichess.org/embed/game/bit1FDAk?pieceSet=horsey&theme=canvas#105"))
    })
    test("render with board rotation", () => {
        render(<RichEmbed url="https://lichess.org/bit1FDAk/black" />)
        expect(new URL(screen.getByTitle(expected.title).src)).toEqual(new URL("https://lichess.org/embed/game/bit1FDAk/black?pieceSet=horsey&theme=canvas"))
    })
    test("render with board rotation and movestamp", () => {
        render(<RichEmbed url="https://lichess.org/bit1FDAk/black#105" />)
        expect(new URL(screen.getByTitle(expected.title).src)).toEqual(new URL("https://lichess.org/embed/game/bit1FDAk/black?pieceSet=horsey&theme=canvas#105"))
    })
})

describe("Lichess studies", () => {
    const expected = {
        title: "Embedded Lichess study"
    };

    test("render", () => {
        render(<RichEmbed url="https://lichess.org/study/ZupRZz3d/eBizjdx8" />)
        expect(new URL(screen.getByTitle(expected.title).src)).toEqual(new URL("https://lichess.org/study/embed/ZupRZz3d/eBizjdx8?pieceSet=horsey&theme=canvas"))
    })
    test("render with movestamp", () => {
        render(<RichEmbed url="https://lichess.org/study/ZupRZz3d/eBizjdx8#89" />)
        expect(new URL(screen.getByTitle(expected.title).src)).toEqual(new URL("https://lichess.org/study/embed/ZupRZz3d/eBizjdx8?pieceSet=horsey&theme=canvas#89"))
    })
})

describe("Spotify songs", () => {
    const expected = {
        url: new URL("https://open.spotify.com/embed/track/1u8r1RRkJMi5Er8ZV9Yyaw"),
        title: "Embedded Spotify song"
    };

    test("render", () => {
        render(<RichEmbed url="https://open.spotify.com/track/1u8r1RRkJMi5Er8ZV9Yyaw" />)
        expect(new URL(screen.getByTitle(expected.title).src)).toEqual(expected.url)
    })
})

describe("SoundCloud songs", () => {
    const expected = {
        url: new URL("https://w.soundcloud.com/player/?url=https://soundcloud.com/yoylecake/hush&color=%23ff5500&auto_play=false&hide_related=true&show_comments=true&show_user=true&show_reposts=true&show_teaser=false"),
        title: "Embedded SoundCloud song"
    };

    test("render", () => {
        render(<RichEmbed url="https://soundcloud.com/yoylecake/hush" />)
        expect(new URL(screen.getByTitle(expected.title).src)).toEqual(expected.url)
    })
})

describe("Steam games", () => {
    const expected = {
        url: new URL("https://store.steampowered.com/widget/282800/?utm_source=quarky"),
        title: "Embedded description of a Steam game"
    };

    test("render", () => {
        render(<RichEmbed url="https://store.steampowered.com/app/282800" />)
        expect(new URL(screen.getByTitle(expected.title).src)).toEqual(expected.url)
    })
})

describe("Tumblr posts", () => {
    const expected = {
        url: new URL("https://embed.tumblr.com/embed/post/meltypen/753727298290778112"),
        title: "Embedded Tumblr post by meltypen"
    };

    test("render", () => {
        render(<RichEmbed url="https://www.tumblr.com/meltypen/753727298290778112/wow-hi-teto-kasane" />)
        expect(new URL(screen.getByTitle(expected.title).src)).toEqual(expected.url)
    })
    test("render with subdomain", () => {
        render(<RichEmbed url="https://meltypen.tumblr.com/post/753727298290778112" />)
        expect(new URL(screen.getByTitle(expected.title).src)).toEqual(expected.url)
    })
})

describe("Tweets", () => {
    const expected = {
        url: new URL("https://platform.twitter.com/embed/Tweet.html?dnt=true&id=1799483071873642550"),
        title: "Embedded Tweet by eepyeri"
    };
    const wrappers = ["x.com", "twitter.com", "fixupx.com", "fxtwitter.com", "vxtwitter.com", "twittpr.com", "fixvx.com"]

    test("no byline with no username", () => {
        render(<RichEmbed url="https://twitter.com/i/status/1799483071873642550" />)
        expect(new URL(screen.getByTitle("Embedded Tweet").src)).toEqual(expected.url)
    })

    test.each(wrappers)("%s", (wrapper) => {
        render(<RichEmbed url={`https://${wrapper}/eepyeri/status/1799483071873642550`} />)
        expect(new URL(screen.getByTitle(expected.title).src)).toEqual(expected.url)
    })
})

describe("YouTube videos", () => {
    const expected = {
        url: new URL("https://www.youtube.com/embed/hJWSBBQ04XI"),
        urlStamped: new URL("https://www.youtube.com/embed/hJWSBBQ04XI?t=12"),
        title: "Embedded YouTube video"
    };

    test("youtube.com", () => {
        render(<RichEmbed url="https://www.youtube.com/watch?v=hJWSBBQ04XI" />)
        expect(new URL(screen.getByTitle(expected.title).src)).toEqual(expected.url)
    })
    test("youtube.com with timestamp", () => {
        render(<RichEmbed url="https://www.youtube.com/watch?v=hJWSBBQ04XI&t=12" />)
        expect(new URL(screen.getByTitle(expected.title).src)).toEqual(expected.urlStamped)
    })

    test("youtu.be", () => {
        render(<RichEmbed url="https://youtu.be/hJWSBBQ04XI" />)
        expect(new URL(screen.getByTitle(expected.title).src)).toEqual(expected.url)
    })
    test("youtu.be with timestamp", () => {
        render(<RichEmbed url="https://youtu.be/hJWSBBQ04XI?t=12" />)
        expect(new URL(screen.getByTitle(expected.title).src)).toEqual(expected.urlStamped)
    })
    test("youtu.be with tracking and timestamp", () => {
        render(<RichEmbed url="https://youtu.be/hJWSBBQ04XI?si=HA8wEF_oas0CgPuD&t=12" />)
        expect(new URL(screen.getByTitle(expected.title).src)).toEqual(expected.urlStamped)
    })
})