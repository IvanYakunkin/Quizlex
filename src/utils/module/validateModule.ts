import { CreateCardInput } from "@/types/module";
import { ValidationErrors, ValidationResult } from "@/types/types";

export const validateAndSanitize = (name: string, description: string, cards: CreateCardInput[]): ValidationResult => {
    const errors: ValidationErrors = {};

    const sanitizedCards = cards.filter(card =>
        card.term?.trim() || card.definition?.trim()
    );

    if (!name.trim()) errors.name = "Name your module";
    if (!description.trim()) errors.description = "Add a description";

    const hasIncomplete = sanitizedCards.some(card =>
        (card.term?.trim() && !card.definition?.trim()) ||
        (!card.term?.trim() && card.definition?.trim())
    );

    if (sanitizedCards.length < 2) {
        errors.cards = "At least two cards are required";
    } else if (hasIncomplete) {
        errors.cards = "All cards must have both a term and a definition";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        sanitizedCards: sanitizedCards
    };
};