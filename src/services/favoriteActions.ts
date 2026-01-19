"use server"

import { getServerSession } from "next-auth";
import { prisma } from "../../lib/prisma";
import { authOptions } from "@/lib/auth";

export async function toggleFavoriteAction(cardId: number, moduleId: number) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        const userId = Number(session.user.id);

        const existingFavorite = await prisma.favoriteCard.findUnique({
            where: {
                userId_cardId: {
                    userId: userId,
                    cardId: cardId,
                },
            },
        });

        if (existingFavorite) {
            await prisma.favoriteCard.delete({
                where: {
                    userId_cardId: {
                        userId: userId,
                        cardId: cardId,
                    },
                },
            });
            return { isFavorite: false };
        } else {
            await prisma.favoriteCard.create({
                data: {
                    userId,
                    cardId,
                    moduleId
                },
            });
            return { isFavorite: true };
        }

    } catch (error) {
        console.error("Toggle Favorite Error:", error);
        return { success: false, error: "Failed to update database" };
    }
}