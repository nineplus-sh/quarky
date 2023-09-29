"use client";
import { useRouter } from 'next/navigation';
import {useEffect} from "react";

export default function Page() {
    const router = useRouter();

    useEffect(() => {
        if(document.cookie.indexOf('cookie_name=') != -1) {
            router.replace("/client");
        } else {
            router.replace("/login");
        }
    }, []);
}