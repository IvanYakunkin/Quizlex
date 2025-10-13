import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

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


