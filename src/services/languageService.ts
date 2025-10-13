import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function getLanguages(){
    const languages = await prisma.language.findMany();
    
    return languages;
}