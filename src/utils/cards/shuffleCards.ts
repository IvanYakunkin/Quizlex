import { BaseCard } from "@/types/module";

export function getRandomInt(min: number, max: number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);

    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

export function shuffleCards(array: BaseCard[]): BaseCard[] {
    const cards: BaseCard[] = [...array];
    const shuffledCards: BaseCard[] = [];

    while (cards.length > 0) {
        shuffledCards.push(cards.splice(getRandomInt(0, cards.length - 1), 1)[0]);
    }

    return shuffledCards;
}