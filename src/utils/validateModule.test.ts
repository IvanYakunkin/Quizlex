import { describe, it, expect } from 'vitest';
import { validateAndSanitize } from './validateModule';
import { Card } from '@/types/types';

describe('validateAndSanitize()', () => {

    it('should return isValid true when all fields are correct', () => {
        const cards = [
            { term: 'Apple', definition: 'Appfel' },
            { term: 'Banana', definition: 'Bananne' }
        ];
        const result = validateAndSanitize('My Module', 'Description', cards as Card[]);

        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual({});
        expect(result.sanitizedCards).toHaveLength(2);
    });

    it('should return errors for empty name and description', () => {
        const result = validateAndSanitize(' ', ' ', []);

        expect(result.isValid).toBe(false);
        expect(result.errors.name).toBe('Name your module');
        expect(result.errors.description).toBe('Add a description');
    });

    it('should return error if less than 2 cards are provided', () => {
        const cards = [{ term: 'Apple', definition: 'Яблоко' }];
        const result = validateAndSanitize('Title', 'Desc', cards as Card[]);

        expect(result.isValid).toBe(false);
        expect(result.errors.cards).toBe('At least two cards are required');
    });

    it('should return error if a card is incomplete (only term or only definition)', () => {
        const cards = [
            { term: 'Apple', definition: 'Яблоко' },
            { term: 'Banana', definition: '' }
        ];
        const result = validateAndSanitize('Title', 'Desc', cards as Card[]);

        expect(result.isValid).toBe(false);
        expect(result.errors.cards).toBe('All cards must have both a term and a definition');
    });

    it('should remove completely empty cards from sanitizedCards', () => {
        const cards = [
            { term: 'Apple', definition: 'Яблоко' },
            { term: 'Banana', definition: 'Банан' },
            { term: '', definition: '' },
            { term: '  ', definition: '  ' }
        ];
        const result = validateAndSanitize('Title', 'Desc', cards as Card[]);

        expect(result.isValid).toBe(true);
        expect(result.sanitizedCards).toHaveLength(2);
        expect(result.sanitizedCards[0].term).toBe('Apple');
    });
});