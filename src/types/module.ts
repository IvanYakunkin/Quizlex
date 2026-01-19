import { Language } from "@/generated/prisma/client";
import { ModuleGetPayload } from "@/generated/prisma/models";
import { findUserModuleAction } from "@/services/moduleActions";

export interface CreateCardInput {
    id?: number;
    isFavorite?: boolean;
    term: string;
    definition: string;
}

export interface BaseCard extends CreateCardInput {
    id: number;
    term: string;
    definition: string;
    isFavorite: boolean;
}

export interface AppModule {
    id: string | number;
    name: string;
    description: string;
    termLanguage: Language;
    definitionLanguage: Language;
    cards: BaseCard[];
    isLocal?: boolean;
}

export type DbModuleWithCount = ModuleGetPayload<{
    include: {
        termLanguage: true;
        definitionLanguage: true;
        _count: { select: { cards: true } };
    };
}>;

export type DbModule = NonNullable<Awaited<ReturnType<typeof findUserModuleAction>>>;

export interface CreateModuleInput {
    name: string;
    description: string;
    termLanguageId: number;
    definitionLanguageId: number;
    cards: CreateCardInput[];
}

export type PreviewCard = {
    term: string;
    definition: string;
    id?: string | number;
    isFavorite?: boolean;
};

export interface CardWithClass extends BaseCard {
    class: string;
}