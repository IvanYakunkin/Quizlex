import { ModuleInterface, Card } from "@/types/types";

// Check answer of wirting-exercise
export function checkWriting(enteredWord:string, translation:string): boolean{
    enteredWord = enteredWord.toLowerCase().trim();
    translation = translation.toLowerCase().trim();

    const enteredWordSeparator = enteredWord.includes(';') ? ';' : ",";
    const translationSeparator = translation.includes(';') ? ';' : ",";
    let isCorrect = false;

    const splittedTranslation = translation.split(enteredWordSeparator);
    const splittedEnteredWord = enteredWord.split(translationSeparator);

    // Check multiple words and multiple translations
    for(let w_id = 0; w_id < splittedEnteredWord.length; w_id++){
        isCorrect = false;

        for(let t_id = 0; t_id < splittedTranslation.length; t_id++){
            if(splittedEnteredWord[w_id].trim() === splittedTranslation[t_id].trim()){
                isCorrect = true;
                break;
            }
        }

        if(!isCorrect) break;
    }
    
    return isCorrect;
}

// Max is not inclusive
export function getRandomInt(min: number, max: number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

export function shuffleCards(array: Card[]): Card[]{
    const cards:Card[] = [...array];
    const shuffledCards:Card[] = [];

    while(cards.length > 0){
        shuffledCards.push(cards.splice(getRandomInt(0, cards.length), 1)[0]);
    }

    return shuffledCards;
}

// Change useState value
function changeFavoriteState(setCards: React.Dispatch<React.SetStateAction<Card[]>>, wordId: number){
    setCards(prevItems => {
        return prevItems.map(card => (
            card.id === wordId ? {...card, isFavorite: !card.isFavorite} : card
        ));
    });
}

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

export function playSound(word: string, language: string){
    const synthesis = new SpeechSynthesisUtterance(word);
    synthesis.lang = language;
    speechSynthesis.speak(synthesis);
}