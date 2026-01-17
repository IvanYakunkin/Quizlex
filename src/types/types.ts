import { Language, Module, Card as CardDB } from "../generated/prisma/browser";

export interface Card {
    id: number;
    term: string | null;
    definition: string | null;
    moduleId?: number;
    isFavorite?: boolean;
}

export type LearningType = "cards" | "test" | "writing";

export interface Tokens {
    refreshToken: string;
    accessToken: string;
}

export interface IAuthDto {
    id: number;
    login: string;
    email: string;
}

export interface LoginOutputData {
    tokens: Tokens;
    user: IAuthDto;
}

export interface Languages {
    term: string;
    definition: string;
}

export interface CardWithFavorite extends Card {
    isFavorite?: boolean;
}

export interface WordsModule extends Module {
    cards: CardWithFavorite[];
    termLanguage: Language;
    definitionLanguage: Language;
}

export interface ModuleInterface {
    languages: Languages;
    cards: Card[];
}

export interface CardWithClass extends Card {
    class: string;
}

export type WritingStatus = "correct" | "finished" | "empty" | "mistake" | "result" | "";
// -1 force to show an answer
export type TestAnswerId = -1 | 0 | 1 | 2 | 3;

// Import separators type
export interface ISeparators {
    name: string;
    value: string;
}

export interface ModuleWithCount extends Module {
    _count: {
        cards: number;
    }
}

// Interface for module with cards and with languages
export interface ModuleMax extends Module {
    cards: CardDB[];
}

export interface ValidationErrors {
    name?: string;
    description?: string;
    cards?: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationErrors;
    sanitizedCards: Card[];
}