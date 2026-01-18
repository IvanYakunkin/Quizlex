import { Card, Module } from "@/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ModuleWithCards } from "@/types/types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

// TODO: add different languages in slug.
function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function prepareCards(cards: Card[], moduleId: number) {
    return cards.map((card) => ({
        term: card.term,
        definition: card.definition,
        moduleId,
    }));
}

// export async function findModuleById(id: number, userId: number) {
//     const foundModule = await prisma.module.findUnique({
//         where: {
//             id: +id,
//             userId
//         },
//         include: {
//             cards: true,
//             termLanguage: true,
//             definitionLanguage: true,
//         }
//     });

//     return foundModule;
// }

export async function createModule(module: Module, cards: Card[], userId: number) {

    const moduleSlug = generateSlug(module.name);
    const preparedModule = { ...module, slug: moduleSlug, userId: userId };

    const createdModule = await prisma.module.create({ data: preparedModule });

    if (!createdModule) {
        throw new Error("Module creation error");
    }

    const preparedCards = prepareCards(cards, createdModule.id);

    await prisma.card.createMany({ data: preparedCards });

    return createdModule;
}

export async function findUserModuleById(userId: number, moduleId: number) {
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

export type UserModule = Awaited<ReturnType<typeof findUserModuleById>>

export async function findUserModules(userId: number) {
    const userModules = prisma.module.findMany({
        where: {
            userId: userId,
        },
        orderBy: {
            id: "desc"
        },
        include: {
            _count: {
                select: { cards: true }
            }
        }
    });

    if (!userModules) {
        return [];
    }

    return userModules;
}

export async function deleteModule(moduleId: number, userId: number) {
    return await prisma.module.delete({
        where: { id: moduleId, userId: userId },
    });
}

export async function updateModule(moduleId: number, userId: number, module: ModuleWithCards, cards: Card[]) {
    const updatedModule = await prisma.module.update({
        where: {
            id: moduleId,
            userId
        },
        data: {
            name: module.name,
            description: module.description,
            termLanguageId: module.termLanguageId,
            definitionLanguageId: module.definitionLanguageId,
            cards: {
                deleteMany: {},
                create: cards.map(card => ({
                    term: card.term,
                    definition: card.definition
                })),
            },
        },
        include: {
            cards: true,
        },
    });
    return updatedModule;
}

export async function updateModuleWord(moduleId: number, userId: number, word: Card) {
    try {
        return await prisma.card.update({
            where: {
                id: word.id,
                moduleId: moduleId,
                module: { userId: userId }
            },
            data: {
                term: word.term,
                definition: word.definition,
            },
        });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return null;
            }
        }
        throw error;
    }
}