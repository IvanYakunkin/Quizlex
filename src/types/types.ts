import { Module } from "@/generated/prisma";
import { Card as CardDBType } from "@/generated/prisma";

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

export interface ModuleInterface{
    languages: Languages;
    cards: Card[];
}

export interface CardWithClass extends Card{
    class: string;
}

export type WritingResultStatus = "correct" | "finished" | "empty" | "mistake" | "result" | "incorrect" | "correctForce" | "";
// -1 force to show an answer
export type TestAnswerId = -1|0|1|2|3;

// Import separators type
export interface ISeparators{
    name: string;
    value: string;
}

export interface ModuleWithCount extends Module{
    _count: {
        cards: number;
    }
}

// Type for module with cards and with languages
export interface ModuleMax extends Module{

    cards: CardDBType[];
}