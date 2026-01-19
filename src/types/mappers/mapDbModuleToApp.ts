import { AppModule, DbModule } from "../module";

export function mapDbModuleToApp(dbModule: DbModule): AppModule {
    return {
        id: dbModule.id,
        name: dbModule.name,
        description: dbModule.description,
        termLanguage: dbModule.termLanguage,
        definitionLanguage: dbModule.definitionLanguage,
        cards: dbModule.cards.map(card => ({
            id: card.id,
            term: card.term ?? "",
            definition: card.definition ?? "",
            isFavorite: card.favoritedBy.length > 0
        })),
        isLocal: false
    };
}