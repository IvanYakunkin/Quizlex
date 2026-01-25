import { DbModuleWithCount } from "@/types/module";
import styles from "../page.module.css";
import Link from "next/link";

export const Module = ({ module }: { module: DbModuleWithCount }) => {
    const date = new Date(module.updatedAt);

    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })

    return (
        <Link href={`/module/${module.id}`} className={styles.module}>
            <div className={styles.info}>
                <div className={styles.name}>{module.name}</div>
                <div className={styles.wordsNumber}>{module._count.cards} words</div>
            </div>

            <div className={styles.date}>{formattedDate}</div>
        </Link>
    );
}