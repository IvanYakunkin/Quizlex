import { Language } from "@/generated/prisma/client";
import { Card, Languages, ModuleInterface } from "@/types/types";

const getLanguageId = (code: string, languages: Language[]) => {
    const foundLanguage = languages.find(lang => lang.code === code);
    return foundLanguage ? foundLanguage.id : 1;
}

export interface CreateModuleDBParams {
    name: string;
    description: string;
    cards: Card[];
    languages: Language[];
    selectedLanguages: Languages;
}

export const createModuleDB = async (params: CreateModuleDBParams) => {
    const moduleData = {
        name: params.name,
        description: params.description,
        termLanguageId: getLanguageId(params.selectedLanguages.term, params.languages),
        definitionLanguageId: getLanguageId(params.selectedLanguages.definition, params.languages),
    }

    try {
        const moduleResponse = await fetch("/api/modules", {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
            },

            body: JSON.stringify({ module: moduleData, cards: params.cards }),
        });

        if (!moduleResponse.ok) {
            throw new Error("Error creating module");
        }

        return await moduleResponse.json();

    } catch (error) {
        console.error(error);
        alert("Error creating a module");
    }
}

export const createModuleLS = (cards: Card[], selectedLanguages: Languages) => {
    const cardsModule: ModuleInterface = { languages: selectedLanguages, cards: cards }
    localStorage.setItem('module', JSON.stringify(cardsModule));

    return cardsModule;
}