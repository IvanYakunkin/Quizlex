import styles from "./CardsPreview.module.css";
import { CreateCardInput } from "@/types/module";
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
    showEditButton?: boolean;
    additionalText?: string;
}

const CardsPreviewInternal = <T extends CreateCardInput>({
    cards,
    changeCards,
    moduleId,
    title,
    language,
    showNumbers,
    showOptions,
    showEditButton,
    additionalText,
}: CardsPreviewProps<T>) => {
    const { toggleFavorite, editCard } = useCardActions(
        changeCards,
        moduleId
    );

    return (
        <div className={styles.wordsPreview}>
            <div className={styles.info}>{title === undefined ? "" : title}</div>
            {cards.length === 0 &&
                <div className={styles.additional}>{additionalText === undefined ? "No data to preview." : additionalText}</div>}

            <div className={styles.previewContainer}>
                {cards.map((card, index) => (
                    <PreviewRow
                        key={card.id ?? index}
                        card={card}
                        toggleFavorite={toggleFavorite}
                        editCard={editCard}
                        index={index}
                        language={language}
                        showNumbers={showNumbers}
                        showOptions={showOptions}
                        showEditButton={showEditButton}
                    />
                ))}
            </div>
        </div>
    );
}

export const CardsPreview = memo(CardsPreviewInternal) as <T extends CreateCardInput>(
    props: CardsPreviewProps<T>
) => React.ReactElement;