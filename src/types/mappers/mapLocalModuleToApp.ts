import { Language } from "@/generated/prisma/browser";
import { AppModule, CreateModuleInput } from "../module";

export function mapLocalModuleToApp(localData: CreateModuleInput, languages: Language[]): AppModule {
    const defualtLanguage = { id: 1, name: 'English', code: 'en' };

    return {
        id: 'temp-id',
        name: localData.name || '',
        description: localData.description || '',
        termLanguage: languages.find(l => l.id === localData.termLanguageId) || defualtLanguage,
        definitionLanguage: languages.find(l => l.id === localData.definitionLanguageId) || defualtLanguage,
        cards: (localData.cards || []).map((c, index) => ({
            id: index,
            term: c.term || '',
            definition: c.definition || '',
            isFavorite: false
        })),
        isLocal: true
    };
}