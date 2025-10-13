import { ISeparators } from "@/types/types";
import { memo } from "react";
import styles from "../page.module.css";

interface SeparatorsProps {
    separators: ISeparators[];
    activeSeparatorId: number;
    setActiveSeparatorId: React.Dispatch<React.SetStateAction<number>>
}

const Separators = (props: SeparatorsProps) => {

    const changeActiveSeparator = (separatorId: number) => {
        props.setActiveSeparatorId(separatorId);
    }

    return (
        <div className={styles.separators}>
            {props.separators.map((separator, key) => (
                <div className={props.activeSeparatorId === key ? `${styles.baseButton} ${styles.separator} ${styles.active}` : `${styles.baseButton} ${styles.separator}`} key={key} onClick={() => changeActiveSeparator(key)}>{separator.name}</div>
            ))}
        </div>
    );
}

export default memo(Separators);