import { describe, expect, it } from "vitest";
import { changeFavoriteState } from "./changeFavoriteState";
import { BaseCard } from "@/types/module";

describe('changeFavoriteState', () => {
    const mockCards: BaseCard[] = [
        { id: 1, isFavorite: false, term: 'a', definition: "aa" },
        { id: 2, isFavorite: true, term: 'b', definition: "bb" },
        { id: 3, isFavorite: false, term: 'c', definition: "cc" },
        { id: 4, isFavorite: false, term: 'd', definition: "dd" },
        { id: 5, isFavorite: false, term: 'e', definition: "ee" },
        { id: 6, isFavorite: false, term: 'f', definition: "ff" },
        { id: 7, isFavorite: false, term: 'g', definition: "gg" },
        { id: 8, isFavorite: false, term: 'h', definition: "hh" },
    ];

    it('should toggle isFavorite from false to true', () => {
        const result = changeFavoriteState(mockCards, 1);
        expect(result[0].isFavorite).toBe(true);
    });

    it('should toggle isFavorite from true to false', () => {
        const result = changeFavoriteState(mockCards, 2);
        expect(result[1].isFavorite).toBe(false);
    });

    it('should not affect other cards', () => {
        const result = changeFavoriteState(mockCards, 1);
        expect(result[1]).toEqual(mockCards[1]);
    });

    it('should return a new array instance (immutability)', () => {
        const result = changeFavoriteState(mockCards, 1);
        expect(result).not.toBe(mockCards);
    });

    it('should return original structure if id is not found', () => {
        const result = changeFavoriteState(mockCards, 999);
        expect(result).toEqual(mockCards);
    });
});