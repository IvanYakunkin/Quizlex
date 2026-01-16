import { Card } from "@/types/types";
import { changeFavoriteState } from "./utils";

export async function setFavoriteDB(setCards: React.Dispatch<React.SetStateAction<Card[]>>, wordId: number, moduleId: number, userEmail: string) {
    changeFavoriteState(setCards, wordId);

    const favoriteResponse = await fetch("/api/favorites/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wordId, moduleId, userEmail }),
    });

    if (!favoriteResponse.ok) {
        throw new Error("Failed to change card info");
    }
}