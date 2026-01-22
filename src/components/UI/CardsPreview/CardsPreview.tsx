import styles from "./CardsPreview.module.css";
import { BaseCard, CreateCardInput } from "@/types/module";
import { FavoriteButton } from "@/components/features/FavoriteButton";
import { SoundButton } from "@/components/features/SoundButton";
import { EditButton } from "@/components/features/EditButton";
import { useCardActions } from "@/hooks/useCardActions";

interface CardsPreviewProps<T extends CreateCardInput> {
    cards: T[];
    changeCards?: (newCards: T[]) => void;
    moduleId?: number;
    title?: string;
    language?: string;
    showNumbers?: boolean;
    showOptions?: boolean;
    additionalText?: string;
}

export const CardsPreview = <T extends CreateCardInput>(
    props: CardsPreviewProps<T>
) => {

    const { toggleFavorite, editCard } = useCardActions(
        props.cards as BaseCard[],
        (props.changeCards || (() => { })) as (cards: BaseCard[]) => void,
        props.moduleId
    );

    return (
        <div className={styles.wordsPreview}>
            <div className={styles.info}>{props.title === undefined ? "" : props.title}</div>
            {props.cards.length === 0 &&
                <div className={styles.additional}>{props.additionalText === undefined ? "No data to preview." : props.additionalText}</div>}

            <div className={styles.previewContainer}>
                {props.cards.map((card, key) => (
                    <div className={styles.previewCard} key={key}>
                        {props.showNumbers && <div className={styles.number}>{key + 1}</div>}
                        <div className={key % 2 === 0 ? styles.data : styles.data + " " + styles.next}>
                            <div className={styles.name}><div>{card.term}</div></div>
                            <div className={styles.definition}>{card.definition}</div>
                            {props.showOptions && props.language &&
                                <div className={styles.options}>

                                    <FavoriteButton
                                        cardId={card.id as number}
                                        isActive={card.isFavorite ?? false}
                                        setActive={() => toggleFavorite(card.id as number)}
                                    />

                                    <EditButton card={card as BaseCard} onSave={editCard} />

                                    <SoundButton word={card.term} language={props.language} />
                                </div>
                            }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}