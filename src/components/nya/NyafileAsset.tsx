'use client'

import { useContext } from 'react';
import { NyafileContext } from "@/components/nya/NyafileProvider";

export default function NyafileAsset() {
    const nyafile = useContext(NyafileContext);
    const listItems = Object.values(nyafile.files).map(item =>
        <li>{item.name}</li>
    );
    return <ul>{listItems}</ul>;
}