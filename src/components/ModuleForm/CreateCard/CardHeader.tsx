import Image from "next/image";
import styles from "./CreateCard.module.css";
import { memo } from "react";

interface CreateHeaderProps {
    cardId: number;
    onDelete: () => void;
}

export const CardHeader = memo(({ cardId, onDelete }: CreateHeaderProps) => {
    return (
        <div className={styles.title}>
            <div className={styles.counter}>{cardId + 1}</div>
            <div className={styles.deleteTitle} onClick={onDelete} title='Delete this card'><Image src="/images/trash-can.png" width={40} height={40} alt="Remove" /></div>
        </div>
    )
});

CardHeader.displayName = "CardHeader";