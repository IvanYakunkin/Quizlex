import { Card } from "@/types/types";

// Change useState value
export function changeFavoriteState(setCards: React.Dispatch<React.SetStateAction<Card[]>>, wordId: number){
    setCards(prevItems => {
        return prevItems.map(card => (
            card.id === wordId ? {...card, isFavorite: !card.isFavorite} : card
        ));
    });
}