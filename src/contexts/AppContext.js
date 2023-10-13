import {createContext} from "react";

/*type AppContextType = {
    loading: boolean,
    setLoading: Dispatch<SetStateAction<boolean>>,
    nyafile: JSZipObject,
    setNyafile: Dispatch<SetStateAction<JSZipObject>>
}*/

/**
 * The app context.
 * @type {React.Context<{}>}
 */
export const AppContext = createContext({});