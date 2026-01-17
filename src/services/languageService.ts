import { prisma } from "../../lib/prisma";

export async function getLanguages() {
    const languages = await prisma.language.findMany();

    return languages;
}