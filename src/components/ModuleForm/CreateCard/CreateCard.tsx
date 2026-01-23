import { memo, useCallback } from "react";
import { WordField } from "@/components/UI/WordField/WordField";
import styles from "./CreateCard.module.css";
import { BaseCard } from "@/types/module";
import { CardHeader } from "./CardHeader";

interface CreateCardProps {
    setCards: React.Dispatch<React.SetStateAction<BaseCard[]>>;
    card: BaseCard
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

    const handleDelete = useCallback(() => {
        deleteCard(cardId);
    }, [deleteCard, cardId]);

    return (

        <div className={styles.card}>
            <CardHeader cardId={cardId} onDelete={handleDelete} />
            <WordField
                card={card}
                updateTerm={updateTerm}
                updateDefinition={updateDefinition}
                useFocus={useFocus}
            />
        </div>
    );
});

CreateCard.displayName = "CreateCard";