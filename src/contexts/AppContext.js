import {createContext} from "react";


/*type AppContextType = {
    loading: boolean,
    setLoading: Dispatch<SetStateAction<boolean>>,
    nyafile: JSZipObject,
    setNyafile: Dispatch<SetStateAction<JSZipObject>>
}*/

/**
 * The app context.
 */
export const AppContext = createContext({
    /** @type {import("@litdevs/nyalib").default} **/
    nyafile: null
});