import { unstable_cache } from 'next/cache';
import { prisma } from '../../lib/prisma';

export const getLanguages = unstable_cache(
    async () => {
        const languages = await prisma.language.findMany();
        return languages;
    },
    ['languages-list'],
    {
        revalidate: 86400,
        tags: ['languages']
    }
);