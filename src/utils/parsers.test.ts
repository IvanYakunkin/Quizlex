import { describe, it, expect } from 'vitest';
import { parseTextToCards } from './parsers';

describe('parseTextToCards', () => {
    const separator = '-';

    it('should parse standard text correctly', () => {
        const input = 'Apple - Яблоко\nBanana - Банан';
        const result = parseTextToCards(input, separator);

        expect(result).toHaveLength(2);
        expect(result[0]).toMatchObject({ term: 'Apple', definition: 'Яблоко', id: 0 });
        expect(result[1]).toMatchObject({ term: 'Banana', definition: 'Банан', id: 1 });
    });

    it('must remove extra spaces (trim)', () => {
        const input = '  Apple   -   Яблоко  ';
        const result = parseTextToCards(input, separator);

        expect(result[0].term).toBe('Apple');
        expect(result[0].definition).toBe('Яблоко');
    });

    it('should ignore empty lines', () => {
        const input = 'Apple - Яблоко\n\n\nBanana - Банан\n';
        const result = parseTextToCards(input, separator);

        expect(result).toHaveLength(2);
    });

    it('should work if only one field is filled in (term or definition)', () => {
        const input = 'OnlyTerm -\n - OnlyDefinition';
        const result = parseTextToCards(input, separator);

        expect(result[0].term).toBe('OnlyTerm');
        expect(result[0].definition).toBe('');
        expect(result[1].term).toBe('');
        expect(result[1].definition).toBe('OnlyDefinition');
    });

    it('should correctly handle custom separators (e.g. Tab)', () => {
        const tabSeparator = '\t';
        const input = 'Apple\tЯблоко';
        const result = parseTextToCards(input, tabSeparator);

        expect(result[0].term).toBe('Apple');
        expect(result[0].definition).toBe('Яблоко');
    });

    it('should return an empty array on empty input', () => {
        expect(parseTextToCards('', '-')).toEqual([]);
        expect(parseTextToCards('\n  \n', '-')).toEqual([]);
    });

    it('If there are multiple separators in a line, it should take the first two elements', () => {
        const input = 'Word - Def - Extra Info';
        const result = parseTextToCards(input, separator);

        expect(result[0].term).toBe('Word');
        expect(result[0].definition).toBe('Def');
    });
});