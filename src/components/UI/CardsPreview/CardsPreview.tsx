import styles from "./CardsPreview.module.css";
import AudioButton from "../AudioButton/AudioButton";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
import { Card } from "@/types/types";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { setFavoriteDB } from "@/utils/favorites/favoritesDB";
import { setFavoriteLS } from "@/utils/favorites/favoritesLS";
import { changeFavoriteState } from "@/utils/favorites/utils";
import { useState } from "react";

interface CardsPreviewProps {
    cards: Card[];
    setCards?: React.Dispatch<React.SetStateAction<Card[]>>;
    title?: string;
    language?: string;
    showNumbers?: boolean;
    showOptions?: boolean;
    additionalText?: string;
}

const CardsPreview = (props: CardsPreviewProps) => {

    const { status } = useSession();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);

    const clickFavoriteBtn = async (wordId: number) => {
        if (props.setCards) {
            if (status === "authenticated" && id) {
                if (isLoading) return;

                setIsLoading(true);
                changeFavoriteState(props.setCards, wordId);

                try {
                    await setFavoriteDB(wordId, +id);
                } catch {
                    changeFavoriteState(props.setCards, wordId);
                } finally {
                    setIsLoading(false);
                }

            } else {
                setFavoriteLS(props.setCards, wordId);
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
                                            wordId={card.id}
                                            setActive={() => clickFavoriteBtn(card.id)}
                                            isActive={card.isFavorite}
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

export default CardsPreview;