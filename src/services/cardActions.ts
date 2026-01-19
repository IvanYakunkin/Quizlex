"use server"

import { authOptions } from "@/lib/auth";
import { BaseCard } from "@/types/module";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { prisma } from "../../lib/prisma";

export async function updateCardAction(moduleId: number, newCard: BaseCard) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return { error: "User is not authorized", status: 401 };
        }

        const userId = Number(session.user.id);

        const updatedCard = await prisma.card.update({
            where: {
                id: newCard.id,
                moduleId,
                module: {
                    userId: userId
                }
            },
            data: {
                term: newCard.term,
                definition: newCard.definition
            }
        });

        revalidatePath(`/modules/${moduleId}`);

        return { data: updatedCard, success: true };

    } catch (error) {
        console.error("Update Card Error:", error);
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return { error: "Card not found", status: 404 };
            }
        }

        return { error: "Internal Server Error", status: 500 };
    }
}