import { describe, expect, it } from "vitest";
import { shuffleCards } from "./shuffleCards";
import { BaseCard } from "@/types/module";

describe('shuffleCards', () => {
    const mockCards: BaseCard[] = [
        { id: 1, isFavorite: false, term: 'a', definition: "aa" },
        { id: 2, isFavorite: false, term: 'b', definition: "bb" },
        { id: 3, isFavorite: false, term: 'c', definition: "cc" },
        { id: 4, isFavorite: false, term: 'd', definition: "dd" },
        { id: 5, isFavorite: false, term: 'e', definition: "ee" },
        { id: 6, isFavorite: false, term: 'f', definition: "ff" },
        { id: 7, isFavorite: false, term: 'g', definition: "gg" },
        { id: 8, isFavorite: false, term: 'h', definition: "hh" },
    ];

    it('should maintain the same elements and length', () => {
        const result = shuffleCards(mockCards);
        expect(result).toHaveLength(mockCards.length);
        expect(result).toEqual(expect.arrayContaining(mockCards));
    });

    it('should not mutate the original input array', () => {
        const originalCopy = [...mockCards];
        shuffleCards(originalCopy);
        expect(originalCopy).toEqual(mockCards);
    });

    it('should actually change the order', () => {
        const result = shuffleCards(mockCards);
        expect(result).not.toEqual(mockCards);
    });

    it('should handle an empty array', () => {
        expect(shuffleCards([])).toEqual([]);
    });

    it('should handle a single element array', () => {
        const single: BaseCard[] = [{ id: 1, isFavorite: false, term: "a", definition: "aa" }];
        expect(shuffleCards(single)).toEqual(single);
    });
});