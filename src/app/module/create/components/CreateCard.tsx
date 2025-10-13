import { Card } from "@/types/types";
import { memo, useCallback } from "react";
import WordField from "@/components/UI/WordField/WordField";
import styles from "../page.module.css";
import Image from "next/image";

interface CreateCardProps {
    setCards: React.Dispatch<React.SetStateAction<Card[]>>;
    card: Card
    cardId: number;
    deleteCard: (id: number) => void;
}

const CreateCard = ({setCards, card, cardId, deleteCard}: CreateCardProps) => {

    const updateTerm = useCallback((value: string) => {
        setCards(prevCards => prevCards.map((card, id) => cardId === id ? {...card, term: value} : card));
    }, [cardId, setCards]);

    const updateDefinition = useCallback((value: string) => {
        setCards(prevCards => prevCards.map((card, id) => cardId === id ? {...card, definition: value} : card));
    }, [cardId, setCards]);

    return (
        
        <div className={styles.card}>
            <div className={styles.card__title}>
                <div className={styles.card__titleCounter}>{cardId + 1}</div>
                <div className={styles.card__titleDelete} onClick={() => deleteCard(cardId)} title='Delete this card'><Image src="/images/trash-can.png" width={40} height={40} alt="Remove" /></div>
            </div>
           
            <WordField 
                cardId={cardId}
                card={card}
                updateTerm={updateTerm}
                updateDefinition={updateDefinition}
            />
        </div>
    )
};

export default memo(CreateCard);