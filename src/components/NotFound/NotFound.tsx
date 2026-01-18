import Link from "next/link"
import styles from "./NotFound.module.css";

export const NotFound = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>404</h1>
            <h2 className={styles.subtitle}>Oops! Page Not Found</h2>
            <p className={styles.message}>
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Link href="/" className={styles.button}>Go back home</Link>
        </div>
    )
}