'use client'

import {createContext, useEffect, useState} from 'react';
import {loadAsync} from 'jszip';

export const NyafileContext = createContext(null);

async function fetchNyafile() {
    const rawFetch = await fetch("/quarky.nya");
    const nyafile = await loadAsync(await rawFetch.blob())
    console.log(nyafile)
    return nyafile;
}

export default function NyafileProvider({children}) {
    const [nyafile, setNyafile] = useState(null)
    useEffect(() =>{
        fetchNyafile().then(nyafile => setNyafile(nyafile))
    },[])
    return <NyafileContext.Provider value={nyafile}>{children}</NyafileContext.Provider>
}