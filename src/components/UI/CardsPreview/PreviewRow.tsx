import { EditButton } from "@/components/features/EditButton";
import styles from "./CardsPreview.module.css";
import { FavoriteButton } from "@/components/features/FavoriteButton";
import { SoundButton } from "@/components/features/SoundButton";
import { BaseCard } from "@/types/module";
import { memo, useCallback } from "react";

interface PreviewRowProps {
    card: BaseCard,
    toggleFavorite: (id: number) => Promise<void>;
    editCard: (newCard: BaseCard) => Promise<void>;
    index: number;
    language?: string;
    showNumbers?: boolean;
    showOptions?: boolean;
}

export const PreviewRow = memo(({ card, toggleFavorite, editCard, index, language, showNumbers, showOptions }: PreviewRowProps) => {
    const favoriteHandleClick = useCallback(() => {
        toggleFavorite(card.id);

    }, [toggleFavorite, card.id]);

    const handleEdit = useCallback((newCard: BaseCard) => {
        editCard(newCard);
    }, [editCard]);

    return (
        <div className={styles.previewCard}>
            {showNumbers && <div className={styles.number}>{index + 1}</div>}
            <div className={index % 2 === 0 ? styles.data : styles.data + " " + styles.next}>
                <div className={styles.name}><div>{card.term}</div></div>
                <div className={styles.definition}>{card.definition}</div>
                {showOptions && language &&
                    <div className={styles.options}>

                        <FavoriteButton
                            cardId={card.id as number}
                            isActive={card.isFavorite ?? false}
                            setActive={favoriteHandleClick}
                        />

                        <EditButton card={card as BaseCard} onSave={handleEdit} />

                        <SoundButton word={card.term} language={language} />
                    </div>
                }
            </div>
        </div>
    );
});

PreviewRow.displayName = "PreviewRow";