import Header from "../components/nav/Header.jsx";
import SpaceBackground from "../components/backgrounds/fullsize/SpaceBackground.jsx";

export default function AuthenticationNeeded() {
    return (<>
        <SpaceBackground />
        <Header title={"Welcome to Quarky~"} description={"Let's sign in to use it now!"}></Header>
    </>)
}