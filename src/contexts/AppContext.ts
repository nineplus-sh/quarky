import {createContext, Dispatch, SetStateAction} from "react";
import {JSZipObject} from "jszip";

type AppContextType = {
    loading: boolean,
    setLoading: Dispatch<SetStateAction<boolean>>,
    nyafile: JSZipObject,
    setNyafile: Dispatch<SetStateAction<JSZipObject>>
}

export const AppContext = createContext<AppContextType | undefined>({});