import styles from "./CreateCard.module.css";
import { memo } from "react";
import { DeleteButton } from "@/components/features/DeleteButton";

interface CreateHeaderProps {
    cardId: number;
    onDelete: () => void;
}

export const CardHeader = memo(({ cardId, onDelete }: CreateHeaderProps) => {
    return (
        <div className={styles.title}>
            <div className={styles.counter}>{cardId + 1}</div>
            <DeleteButton onBtnClick={onDelete} tabIndex={-1} />
        </div>
    )
});

CardHeader.displayName = "CardHeader";