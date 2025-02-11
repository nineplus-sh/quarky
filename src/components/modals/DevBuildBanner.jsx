import styles from "./DevBuildBanner.module.css";
export default function DevBuildBanner() {
    return <div className={styles.devBuildBanner}>
        <span>This is a test build of Quarky. ninePLUS is not responsible for any unauthorized explosions.</span>
        {import.meta.env.VITE_GIT_COMMIT ? <span>
            It was built from <a href={`https://github.com/nineplus-sh/quarky/commit/${import.meta.env.VITE_GIT_COMMIT}`} target={"_blank"}>this commit</a>, which was about &quot;{import.meta.env.VITE_GIT_COMMIT_MSG}&quot;.
        </span> : null}
    </div>
}