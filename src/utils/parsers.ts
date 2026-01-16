import { Card } from "@/types/types";

export const parseTextToCards = (text: string, separator: string): Card[] => {
    return text.split("\n")
        .map(pair => pair.split(separator).map(el => el.trim()))
        .filter(([term, definition]) => term || definition)
        .map(([term = "", definition = ""], key) => ({
            id: key,
            term,
            definition,
            isFavorite: false
        }));
};