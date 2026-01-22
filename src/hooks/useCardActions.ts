import { useState } from 'react';
import { BaseCard } from '@/types/module';
import { setFavoriteLS } from '@/utils/favorites/favoritesLS';
import { changeFavoriteState } from '@/utils/favorites/changeFavoriteState';
import { useSession } from 'next-auth/react';
import { toggleFavoriteAction } from '@/services/favoriteActions';
import { updateCardAction } from '@/services/cardActions';

export const useCardActions = (
    cards: BaseCard[],
    changeCards: (cards: BaseCard[]) => void,
    moduleId?: number
) => {
    const [isLoading, setIsLoading] = useState(false);
    const { data: session, status } = useSession();

    const toggleFavorite = async (cardId: number) => {
        const updatedCards = changeFavoriteState(cards, cardId);

        if (status === "authenticated") {
            if (isLoading) return;
            setIsLoading(true);

            changeCards(updatedCards);

            const result = await toggleFavoriteAction(cardId, +session.user.id);

            if (result.error || result.success === false) {
                changeCards(changeFavoriteState(updatedCards, cardId));
                console.error(result.error);
            }
            setIsLoading(false);
        } else {
            setFavoriteLS(cardId);
            changeCards(updatedCards);
        }
    };

    const editCard = async (newCard: BaseCard) => {
        const updatedCards = cards.map(card => card.id === newCard.id ? newCard : card);
        changeCards(updatedCards);
        if (status === "authenticated") {
            if (!moduleId) return;
            await updateCardAction(moduleId, newCard);
        } else {
            const storedData = localStorage.getItem('module');
            if (storedData) {
                const cardsModule = JSON.parse(storedData);
                cardsModule.cards = updatedCards;
                localStorage.setItem('module', JSON.stringify(cardsModule));
            }
        }
    };

    return { toggleFavorite, editCard };
};