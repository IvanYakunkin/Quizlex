import { Card } from "@/types/types";

// Change useState value
function changeFavoriteState(setCards: React.Dispatch<React.SetStateAction<Card[]>>, wordId: number){
    setCards(prevItems => {
        return prevItems.map(card => (
            card.id === wordId ? {...card, isFavorite: !card.isFavorite} : card
        ));
    });
}

export async function setFavoriteDB(setCards: React.Dispatch<React.SetStateAction<Card[]>>, wordId: number, moduleId: number, userEmail: string){
    changeFavoriteState(setCards, wordId);
    
    const favoriteResponse = await fetch("/api/favorites/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({wordId, moduleId, userEmail}),
    });

    if(!favoriteResponse.ok){
        throw new Error("Failed to change card info");
    }
}