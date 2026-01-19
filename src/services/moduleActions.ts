"use server"

import { prisma } from "../../lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CreateCardInput, CreateModuleInput } from "@/types/module";

function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export async function createModuleAction(moduleData: CreateModuleInput) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return { error: "User is not authorized", status: 401 };
        }

        if (!moduleData) {
            return { error: "Module data not found!", status: 400 };
        }

        const userId = Number(session.user.id);
        const moduleSlug = generateSlug(moduleData.name);

        const createdModule = await prisma.module.create({
            data: {
                name: moduleData.name,
                description: moduleData.description,
                termLanguageId: moduleData.termLanguageId,
                definitionLanguageId: moduleData.definitionLanguageId,
                slug: moduleSlug,
                userId,
                cards: {
                    create: moduleData.cards.map(card => ({
                        term: card.term,
                        definition: card.definition,
                    }))
                }
            }
        });

        revalidatePath('/modules');

        return { data: createdModule, success: true };

    } catch (error) {
        console.error("Server Action Error:", error);
        return { error: "Internal Server Error", status: 500 };
    }
}

export async function findUserModuleAction(moduleId: number) {
    const session = await getServerSession(authOptions);
    if (!session?.user.id) throw new Error("Unauthorized");
    const userId = Number(session.user.id);

    const wordsModule = await prisma.module.findFirst({
        where: {
            id: moduleId,
            userId: userId,
        },
        include: {
            termLanguage: true,
            definitionLanguage: true,
            cards: {
                include: {
                    favoritedBy: {
                        where: {
                            userId
                        }
                    }
                }
            },
        },
    });

    return wordsModule;
}

export async function deleteModuleAction(moduleId: number) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return { error: "Unauthorized", status: 401 };
        }

        const userId = Number(session.user.id);

        await prisma.module.delete({
            where: {
                id: moduleId,
                userId: userId,
            },
        });

        revalidatePath('/modules');
        revalidatePath(`/modules/${moduleId}`);

    } catch (error) {
        console.error("Delete Module Error:", error);

        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return { error: "Card not found", status: 404 };
            }
        }

        return { error: "Failed to delete module", status: 500 };
    }
}

export async function getUserModulesAction() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return { error: "Unauthorized", status: 401 };
        }

        const userId = Number(session.user.id);

        const modules = await prisma.module.findMany({
            where: {
                userId: userId,
            },
            include: {
                termLanguage: true,
                definitionLanguage: true,
                _count: {
                    select: {
                        cards: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return { data: modules, success: true };

    } catch (error) {
        console.error("Fetch Modules Error:", error);
        return { error: "Failed to fetch modules", status: 500 };
    }
}

export async function updateModuleAction(moduleId: number, newModule: CreateModuleInput) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return { error: "Unauthorized", status: 401 };

        const userId = Number(session.user.id);

        const result = await prisma.$transaction(async (tx) => {
            const existingModule = await tx.module.findUnique({
                where: { id: moduleId, userId: userId }
            });

            if (!existingModule) throw new Error("Module not found or access denied");

            const updated = await tx.module.update({
                where: { id: moduleId },
                data: {
                    name: newModule.name,
                    description: newModule.description,
                    termLanguageId: newModule.termLanguageId,
                    definitionLanguageId: newModule.definitionLanguageId,
                    cards: {
                        deleteMany: {},
                        create: newModule.cards.map((card: CreateCardInput) => ({
                            term: card.term,
                            definition: card.definition,
                        }))
                    }
                }
            });

            return updated;
        });

        revalidatePath(`/modules/${moduleId}`);
        revalidatePath('/modules');

        return { data: result, success: true };
    } catch (error) {
        console.error("Update Module Error:", error);
        return { error: error || "Failed to update module", status: 500 };
    }
}