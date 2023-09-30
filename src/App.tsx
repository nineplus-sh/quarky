import {AppContext} from "./contexts/AppContext.ts";
import {useState} from "react";
import Main from "./components/Main.tsx";

function App() {
  let nyafile = useState(null);
  let [loading, setLoading] = useState(true);

  return (
      <AppContext.Provider value={{loading, setLoading, nyafile}}>
        <Main />
      </AppContext.Provider>
  )
}

export default App
