import { prisma } from "../../lib/prisma";
export const getLanguages = async () => {
    return await prisma.language.findMany();
}
