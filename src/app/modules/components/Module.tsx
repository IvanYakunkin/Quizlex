import styles from "../page.module.css";
import Link from "next/link";
import { ModuleWithCount } from "@/types/types";

interface ModuleProps{
    module: ModuleWithCount;
}

const Module = ({module}: ModuleProps) => {
    
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

export default Module;