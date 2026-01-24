export function getRandomInt(min: number, max: number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);

    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

export function shuffleCards<T>(array: T[]): T[] {
    const cards: T[] = [...array];
    const shuffledCards: T[] = [];

    while (cards.length > 0) {
        shuffledCards.push(cards.splice(getRandomInt(0, cards.length - 1), 1)[0]);
    }

    return shuffledCards;
}