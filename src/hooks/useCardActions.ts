import { useCallback, useRef } from 'react';
import { BaseCard } from '@/types/module';
import { setFavoriteLS } from '@/utils/favorites/favoritesLS';
import { changeFavoriteState } from '@/utils/favorites/changeFavoriteState';
import { useSession } from 'next-auth/react';
import { toggleFavoriteAction } from '@/services/favoriteActions';
import { updateCardAction } from '@/services/cardActions';

export const useCardActions = <T extends BaseCard>(
    changeCards?: React.Dispatch<React.SetStateAction<T[]>>,
    moduleId?: number
) => {
    const { data: session, status } = useSession();
    const loadingRef = useRef(false);

    const toggleFavorite = useCallback(async (cardId: number) => {
        if (!changeCards) return;

        if (status === "authenticated") {
            if (loadingRef.current) return;
            loadingRef.current = true;

            changeCards((prev) => changeFavoriteState(prev, cardId) as T[]);

            try {
                const result = await toggleFavoriteAction(cardId, +session.user.id);

                if (result.error || result.success === false) {
                    changeCards((prev) => changeFavoriteState(prev, cardId));
                    console.error(result.error);
                }
            } catch {
                changeCards((prev) => changeFavoriteState(prev, cardId));
            } finally {
                loadingRef.current = false;
            }
        } else {
            setFavoriteLS(cardId);
            changeCards((prev) => changeFavoriteState(prev, cardId) as T[]);
        }
    }, [status, session?.user?.id, changeCards]);

    const editCard = useCallback(async (newCard: BaseCard) => {
        if (!changeCards) return;

        changeCards((prev) => prev.map(card => card.id === newCard.id ? newCard : card) as T[]);
        if (status === "authenticated") {
            if (!moduleId) return;
            await updateCardAction(moduleId, newCard);
        } else {
            const storedData = localStorage.getItem('module');
            if (storedData) {
                const cardsModule = JSON.parse(storedData);
                cardsModule.cards = cardsModule.cards.map((c: BaseCard) => c.id === newCard.id ? newCard : c);
                localStorage.setItem('module', JSON.stringify(cardsModule));
            }
        }
    }, [status, moduleId, changeCards]);

    return { toggleFavorite, editCard };
};