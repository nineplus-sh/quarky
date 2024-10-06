import styles from "./DevBuildBanner.module.css";
export default function DevBuildBanner() {
    return <div className={styles.devBuildBanner}>
        <span>This is a test build of Quarky. ninePLUS is not responsible for any unauthorized explosions.</span>
        {import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA ? <span>
            It was built from <a href={`https://github.com/${import.meta.env.VITE_VERCEL_GIT_REPO_OWNER}/${import.meta.env.VITE_VERCEL_GIT_REPO_SLUG}/commit/${import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA}`} target={"_blank"}>this commit</a> by {import.meta.env.VITE_VERCEL_GIT_COMMIT_AUTHOR_LOGIN}, who said &quot;{import.meta.env.VITE_VERCEL_GIT_COMMIT_MESSAGE}&quot;.
        </span> : null}
    </div>
}