import { Card, ModuleInterface } from "@/types/types";
import { changeFavoriteState } from "./utils";

export function setFavoriteLS(setCards: React.Dispatch<React.SetStateAction<Card[]>>, wordId: number){
    changeFavoriteState(setCards, wordId);
    // Add or remove from favorites in local storage
    const localModule = localStorage.getItem("module");
    if(localModule){
        const cardsModule: ModuleInterface = JSON.parse(localModule);
        cardsModule.cards[wordId].isFavorite = !cardsModule.cards[wordId].isFavorite;
        localStorage.setItem("module", JSON.stringify(cardsModule));
    }   
}