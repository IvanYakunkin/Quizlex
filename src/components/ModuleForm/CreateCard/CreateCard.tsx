import { Card } from "@/types/types";
import { memo, useCallback } from "react";
import WordField from "@/components/UI/WordField/WordField";
import styles from "./CreateCard.module.css";
import Image from "next/image";

interface CreateCardProps {
    setCards: React.Dispatch<React.SetStateAction<Card[]>>;
    card: Card
    cardId: number;
    deleteCard: (id: number) => void;
    useFocus: boolean;
}

export const CreateCard = memo(({ setCards, card, cardId, deleteCard, useFocus }: CreateCardProps) => {

    const updateTerm = useCallback((value: string) => {
        setCards(prevCards => prevCards.map((card, id) => cardId === id ? { ...card, term: value } : card));
    }, [cardId, setCards]);

    const updateDefinition = useCallback((value: string) => {
        setCards(prevCards => prevCards.map((card, id) => cardId === id ? { ...card, definition: value } : card));
    }, [cardId, setCards]);

    return (

        <div className={styles.card}>
            <div className={styles.title}>
                <div className={styles.counter}>{cardId + 1}</div>
                <div className={styles.deleteTitle} onClick={() => deleteCard(cardId)} title='Delete this card'><Image src="/images/trash-can.png" width={40} height={40} alt="Remove" /></div>
            </div>

            <WordField
                cardId={cardId}
                card={card}
                updateTerm={updateTerm}
                updateDefinition={updateDefinition}
                useFocus={useFocus}
            />
        </div>
    );
});

CreateCard.displayName = "CreateCard";