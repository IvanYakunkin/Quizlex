import { Card, Module, PrismaClient } from '@/generated/prisma/client';

const prisma = new PrismaClient();

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

export async function findModuleById(id: number) {
    const prisma = new PrismaClient();
    const foundModule = await prisma.module.findUnique({
        where: {
            id: +id,
        },
        include: {
            cards: true,
            termLanguage: true,
            definitionLanguage: true,
        }
    });

    return foundModule;
}

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

    const wordsModule = await prisma.module.findUnique({
        where: {
            id: +moduleId,
            userId: userId,
        },
        include: {
            cards: true,
        },
    });

    if (!wordsModule) {
        throw new Error("Module not found");
    }

    return wordsModule;
}

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
    const deletedModule = await prisma.module.delete({
        where: { id: +moduleId, userId: userId },
    });

    return deletedModule;
}

export async function updateModuleWord(moduleId: number, userId: number, word: Card) {
    const updatedModule = await prisma.card.update({
        where: {
            id: word.id,
            moduleId: +moduleId,
            module: { userId: userId }
        },
        data: {
            term: word.term,
            definition: word.definition,
        },
    });

    return updatedModule;
}