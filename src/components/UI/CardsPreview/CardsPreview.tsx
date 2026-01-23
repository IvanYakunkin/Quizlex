import styles from "./CardsPreview.module.css";
import { BaseCard, CreateCardInput } from "@/types/module";
import { useCardActions } from "@/hooks/useCardActions";
import { memo } from "react";
import { PreviewRow } from "./PreviewRow";

interface CardsPreviewProps<T extends CreateCardInput> {
    cards: T[];
    changeCards?: React.Dispatch<React.SetStateAction<T[]>>;
    moduleId?: number;
    title?: string;
    language?: string;
    showNumbers?: boolean;
    showOptions?: boolean;
    additionalText?: string;
}

export const CardsPreview = memo(<T extends BaseCard>(
    props: CardsPreviewProps<T>
) => {
    const { toggleFavorite, editCard } = useCardActions(props.changeCards, props.moduleId);

    return (
        <div className={styles.wordsPreview}>
            <div className={styles.info}>{props.title === undefined ? "" : props.title}</div>
            {props.cards.length === 0 &&
                <div className={styles.additional}>{props.additionalText === undefined ? "No data to preview." : props.additionalText}</div>}

            <div className={styles.previewContainer}>
                {props.cards.map((card, index) => (
                    <PreviewRow
                        key={card.id}
                        card={card}
                        toggleFavorite={toggleFavorite}
                        editCard={editCard}
                        index={index}
                        language={props.language}
                        showNumbers={props.showNumbers}
                        showOptions={props.showOptions}
                    />
                ))}
            </div>
        </div>
    );
});

CardsPreview.displayName = "CardsPreview";