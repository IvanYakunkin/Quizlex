import styles from "./CardsPreview.module.css";
import AudioButton from "../AudioButton/AudioButton";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { setFavoriteLS } from "@/utils/favorites/favoritesLS";
import { changeFavoriteState } from "@/utils/favorites/utils";
import { useState } from "react";
import { CreateCardInput } from "@/types/module";
import { toggleFavoriteAction } from "@/services/favoriteActions";

interface CardsPreviewProps<T extends CreateCardInput> {
    cards: T[];
    changeCards?: (newCards: T[]) => void;
    title?: string;
    language?: string;
    showNumbers?: boolean;
    showOptions?: boolean;
    additionalText?: string;
}

export const CardsPreview = <T extends CreateCardInput>(
    props: CardsPreviewProps<T>
) => {
    const { status } = useSession();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);

    const clickFavoriteBtn = async (cardId: number) => {
        if (status === "authenticated" && id && props.changeCards) {
            if (isLoading) return;

            setIsLoading(true);
            props.changeCards(changeFavoriteState(props.cards, cardId));
            const result = await toggleFavoriteAction(cardId, +id);

            if (result.error || result.success === false) {
                props.changeCards(changeFavoriteState(props.cards, cardId));
                console.error(result.error);
            }

            setIsLoading(false);
        } else {
            setFavoriteLS(cardId);
            if (props.changeCards) {
                const d = changeFavoriteState(props.cards, cardId);
                props.changeCards(d);
            }
        }
    }


    return (
        <div className={styles.wordsPreview}>
            <div className={styles.info}>{props.title === undefined ? "" : props.title}</div>
            {props.cards.length === 0 &&
                <div className={styles.additional}>{props.additionalText === undefined ? "No data to preview." : props.additionalText}</div>}

            <div className={styles.previewContainer}>
                {props.cards.map((card, key) => (
                    <div className={styles.previewTerm} key={key}>
                        {props.showNumbers && <div className={styles.number}>{key + 1}</div>}
                        <div className={key % 2 === 0 ? styles.data : styles.data + " " + styles.next}>
                            <div className={styles.name}><div>{card.term}</div></div>
                            <div className={styles.definition}>{card.definition}</div>
                            {props.showOptions && props.language &&
                                <div className={styles.options}>
                                    <div className={styles.favorite}>
                                        <FavoriteButton
                                            size={21}
                                            hoverColor="var(--blue-color-400)"
                                            cardId={card.id as number}
                                            setActive={() => clickFavoriteBtn(card.id as number)}
                                            isActive={card.isFavorite ?? false}
                                        />
                                    </div>
                                    <div className={styles.playSound}>
                                        <AudioButton
                                            word={card.term}
                                            language={props.language}
                                            size={25}
                                            hoverColor="var(--blue-color-400)"
                                        />
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}