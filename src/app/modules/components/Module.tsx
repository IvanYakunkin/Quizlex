import { DbModuleWithCount } from "@/types/module";
import styles from "../page.module.css";
import Link from "next/link";

export const Module = ({ module }: { module: DbModuleWithCount }) => {
    return (
        <Link href={`/module/${module.id}`} className={styles.module}>
            <div className={styles.info}>
                <div className={styles.name}>{module.name}</div>
                <div className={styles.wordsNumber}>{module._count.cards} words</div>
            </div>

            <div className={styles.date}>{module.updatedAt.toDateString()}</div>
        </Link>
    );
}