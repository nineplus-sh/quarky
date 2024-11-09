const richEmbedSamples = [
    "https://play.spotify.com/track/6zLfXq8Gbz6Z6aYk1LcgLR",
    "https://play.spotify.com/track/4TY0ecl4AEbkuK6aQhcFsH",
    "https://play.spotify.com/track/2JzzrNu4B3YZSnE3YWuzDk",
    "https://play.spotify.com/track/1YOXvTJluKQqrDxDg97Kwo",
    "https://play.spotify.com/track/1gOJ1WqxIGAjwXiY0zyaJq",
    "https://play.spotify.com/track/3filrFWJa0ecHVtJZANEzc",
    "https://play.spotify.com/track/3N2lo2io4biJvf5od9azJz",
    "https://play.spotify.com/track/3uHi6KtSfHKs86DZyUfLvl",
    "https://play.spotify.com/track/68cGngZvXl6qKGLH3joVpZ",
    "https://play.spotify.com/track/2WvOOaeYgMrVSC2skGWa3o",
    "https://play.spotify.com/track/79rkmCPwMvGHLw6djzpIYa",
    "https://play.spotify.com/track/3tsXVcKA7ycIRkny6BCumG",
    "https://play.spotify.com/track/2x9hRl4ilVcTN1bJaU0aVX",
    "https://play.spotify.com/track/0obMtFToN1SPx622t440ai",
    "https://play.spotify.com/track/2CYxvKWRsotArVl5zEHsEU",
    "https://play.spotify.com/track/5Wmr3gmwS4LVaZmf9wggOi",
    "https://play.spotify.com/track/5tvreO7IMlv3ufuDYe28E5",
    "https://play.spotify.com/track/1d6EatnCY8nH2YltbnU0Du",
    "https://play.spotify.com/track/3QYVD4X8iOCobsIBXHYWkA",
    "https://play.spotify.com/track/0GcLTGsndM5pTQmyuBHw3E",
    "https://play.spotify.com/track/68SGtb8XvcQ5OJ8JmndUtv",
    "https://play.spotify.com/track/1KzGLpshu5gqedvTztvEEG",
    "https://play.spotify.com/track/0AMMdXWOcKECI8eTIHs8du",
    "https://play.spotify.com/track/7t7yqLwd9NfZD3meOZRme8",
    "https://play.spotify.com/track/2OPLRv0hXGCFMo3jTTkPVs",
    "https://play.spotify.com/track/4HbZmSjGcglZX7UgEokLki",
    "https://play.spotify.com/track/2h0pEi1l32inCs6xu2ZO6d",
    "https://play.spotify.com/track/7nGL6svEPOUJofkyVqXnRm",
    "https://play.spotify.com/track/0E8VeBqiC4oD46hwDto7HD",
    "https://play.spotify.com/track/76Yx4feEnLzKHEvpkfO49L",

    "https://www.youtube.com/watch?v=hJWSBBQ04XI",
    "https://www.youtube.com/watch?v=6h84rfCaGyY",

    "https://twitter.com/girlpoisoner/status/1823413661626720680",
    "https://twitter.com/paxiti/status/1117105167998967808",
    "https://twitter.com/kyoroniki/status/1788795663230312488",

    "https://nyakase.tumblr.com/post/726753957782896641",
    "https://nyakase.tumblr.com/post/727779780105256960",
    "https://nyakase.tumblr.com/post/731348628802830336",
    "https://nyakase.tumblr.com/post/731800820637663232",
    "https://nyakase.tumblr.com/post/733334509466124288",
    "https://nyakase.tumblr.com/post/735780252126724096",
    "https://nyakase.tumblr.com/post/735804817454317568",
    "https://nyakase.tumblr.com/post/735805635014311936",
    "https://nyakase.tumblr.com/post/755283121434509312",
    "https://nyakase.tumblr.com/post/735849296218423297",
    "https://nyakase.tumblr.com/post/735881736979906560",
    "https://nyakase.tumblr.com/post/735859713408925696",
    "https://nyakase.tumblr.com/post/735948205632651264",
    "https://nyakase.tumblr.com/post/736047744215547904",
    "https://nyakase.tumblr.com/post/736071792473538560",
    "https://nyakase.tumblr.com/post/735962148956717056",
    "https://nyakase.tumblr.com/post/736397530882015232",
    "https://nyakase.tumblr.com/post/739392195405217792",
    "https://nyakase.tumblr.com/post/741290447079669760",
    "https://nyakase.tumblr.com/post/741838618416627712",
    "https://nyakase.tumblr.com/post/742609118942085120",
    "https://nyakase.tumblr.com/post/742651466796433408",
    "https://nyakase.tumblr.com/post/743466836771913728",
    "https://nyakase.tumblr.com/post/744203950405861377",
    "https://nyakase.tumblr.com/post/746747294331895808",
    "https://nyakase.tumblr.com/post/747441536744194048",
    "https://nyakase.tumblr.com/post/748441871047606272",
    "https://nyakase.tumblr.com/post/747713912884068352",
    "https://nyakase.tumblr.com/post/748911644652994560",
    "https://nyakase.tumblr.com/post/749623106676703232",
    "https://nyakase.tumblr.com/post/751072232907931648",
    "https://nyakase.tumblr.com/post/751261836453806080",
    "https://nyakase.tumblr.com/post/751464072717942784",
    "https://nyakase.tumblr.com/post/751558161096474624",
    "https://nyakase.tumblr.com/post/751561030137774080",
    "https://nyakase.tumblr.com/post/752013604411392000",
    "https://nyakase.tumblr.com/post/752258127303458816",
    "https://nyakase.tumblr.com/post/752848051908067328",
    "https://nyakase.tumblr.com/post/752874109461987328",
    "https://nyakase.tumblr.com/post/752899009632468992",
    "https://nyakase.tumblr.com/post/752998445183336448",
    "https://nyakase.tumblr.com/post/753167832720769024",
    "https://nyakase.tumblr.com/post/753366335517507584",
    "https://nyakase.tumblr.com/post/753370318496776192",
    "https://nyakase.tumblr.com/post/753663961327681536",
    "https://nyakase.tumblr.com/post/753692553383149568",
    "https://nyakase.tumblr.com/post/753698551523082241",
    "https://nyakase.tumblr.com/post/753717680008265728",
    "https://nyakase.tumblr.com/post/753723847744864256",
    "https://nyakase.tumblr.com/post/753800932703256576",
    "https://nyakase.tumblr.com/post/753926853722554368",
    "https://nyakase.tumblr.com/post/753927372613500928",
    "https://nyakase.tumblr.com/post/753971394148204544",
    "https://nyakase.tumblr.com/post/753973927185874944",
    "https://nyakase.tumblr.com/post/754208320860127232",
    "https://nyakase.tumblr.com/post/754720705522909184",
    "https://nyakase.tumblr.com/post/754722660996595712",
    "https://nyakase.tumblr.com/post/754745142155558913",
    "https://nyakase.tumblr.com/post/754745169603133440",
    "https://nyakase.tumblr.com/post/754786946539307008",
    "https://nyakase.tumblr.com/post/754800027756609536",
    "https://nyakase.tumblr.com/post/754968471800070144",
    "https://nyakase.tumblr.com/post/755111209679847425",
    "https://nyakase.tumblr.com/post/755234658530279424",
    "https://nyakase.tumblr.com/post/755342885445156864",
    "https://nyakase.tumblr.com/post/763151527847313408",
    "https://nyakase.tumblr.com/post/763321940462141440",
    "https://nyakase.tumblr.com/post/763506892856262656",
    "https://nyakase.tumblr.com/post/763701151965249536"
]

export default richEmbedSamples;
