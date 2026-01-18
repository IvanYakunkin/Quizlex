import { Card } from "@/types/types";

export function changeFavoriteState(setCards: React.Dispatch<React.SetStateAction<Card[]>>, cardId: number) {
    setCards(prevItems => {
        return prevItems.map(card => (
            card.id === cardId ? { ...card, isFavorite: !card.isFavorite } : card
        ));
    });
}