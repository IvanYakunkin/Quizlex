import { Language } from "@/generated/prisma/browser";
import { CreateCardInput } from "./module";

export type LearningType = "cards" | "test" | "writing" | "match";

export interface Languages {
    term: Language;
    definition: Language;
}

export type WritingStatus = "correct" | "finished" | "empty" | "mistake" | "result" | "";
// -1 force to show an answer
export type TestAnswerId = -1 | 0 | 1 | 2 | 3;

// Import separators type
export interface ISeparators {
    name: string;
    value: string;
}

export interface ValidationErrors {
    name?: string;
    description?: string;
    cards?: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationErrors;
    sanitizedCards: CreateCardInput[];
}

export interface MatchCard {
    cardId: number;
    displayValue: string;
}

export interface StudySettings {
    frontLanguage: Language;
    isStudyFavorites: boolean;
    isPronounce: boolean;
    wordsPerRound?: number;
    trackProgress?: boolean;
}