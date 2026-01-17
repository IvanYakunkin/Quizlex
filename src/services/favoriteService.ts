import { prisma } from "../../lib/prisma";

export const getFavoriteCards = async (userId: number, moduleId: number) => {
    const favoriteCards = await prisma.favoriteCard.findMany({
        where: {
            userId: userId,
            moduleId: +moduleId
        },
        select: {
            cardId: true,
        }
    });

    const favoriteIds = favoriteCards.map(fav => fav.cardId);

    return favoriteIds;
}

export const isCardFavorite = async (userId: number, cardId: number) => {
    const existingFavorite = await prisma.favoriteCard.findUnique({
        where: {
            userId_cardId: {
                userId,
                cardId
            }
        }
    });

    return existingFavorite ? true : false;
}

export const deleteCardFavorite = async (userId: number, cardId: number) => {
    const deletedFavorite = await prisma.favoriteCard.delete({
        where: {
            userId_cardId: {
                userId,
                cardId,
            }
        }
    });

    return deletedFavorite;
}

export const setCardFavorite = async (userId: number, moduleId: number, cardId: number) => {
    const createdFavorite = await prisma.favoriteCard.create({
        data: {
            userId,
            moduleId,
            cardId
        }
    });

    return createdFavorite;
}


