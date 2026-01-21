import { CreateCardInput } from "@/types/module";

export function changeFavoriteState<T extends CreateCardInput>(
    cards: T[],
    cardId: string | number
): T[] {
    return cards.map(card => (
        card.id === cardId ? { ...card, isFavorite: !card.isFavorite } : card
    ));
}