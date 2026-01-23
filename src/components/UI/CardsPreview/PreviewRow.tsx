import { EditButton } from "@/components/features/EditButton";
import styles from "./CardsPreview.module.css";
import { FavoriteButton } from "@/components/features/FavoriteButton";
import { SoundButton } from "@/components/features/SoundButton";
import { BaseCard, CreateCardInput } from "@/types/module";
import { memo, useCallback } from "react";

interface PreviewRowProps<T extends CreateCardInput> {
    card: T,
    toggleFavorite: (id: number) => Promise<void>;
    editCard: (newCard: BaseCard) => Promise<void>;
    index: number;
    language?: string;
    showNumbers?: boolean;
    showOptions?: boolean;
    showEditButton?: boolean;
}

export const PreviewRow = memo(<T extends CreateCardInput>({
    card,
    toggleFavorite,
    editCard,
    index,
    language,
    showNumbers,
    showOptions,
    showEditButton
}: PreviewRowProps<T>) => {

    const favoriteHandleClick = useCallback(() => {
        if (card.id) {
            toggleFavorite(card.id);
        }

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

                        {showEditButton && <EditButton card={card as BaseCard} onSave={handleEdit} />}

                        <SoundButton word={card.term} language={language} />
                    </div>
                }
            </div>
        </div>
    );
});

PreviewRow.displayName = "PreviewRow";