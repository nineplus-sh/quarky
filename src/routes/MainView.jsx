import styles from "./MainView.module.css";
import QuarkList from "../components/_services/lightquark/nav/QuarkList.jsx";
import JoinQuark from "../components/_services/lightquark/nav/JoinQuark.jsx";
import {Outlet} from "react-router-dom";

export default function MainView() {
    return <>
        <div className={styles.quarkList}>
            <QuarkList/>
            <JoinQuark/>
        </div>
        <Outlet/>
    </>
}