import { describe, it, expect } from 'vitest';
import { checkWriting } from './checkWriting';

describe('checkWriting()', () => {

    it('should return true for exact matches regardless of case or spaces', () => {
        expect(checkWriting('Apple', 'apple')).toBe(true);
        expect(checkWriting('  banana  ', 'Banana')).toBe(true);
        expect(checkWriting('Яблоко', 'яблоко')).toBe(true);
    });

    it('should return false for completely different words', () => {
        expect(checkWriting('Apple', 'Orange')).toBe(false);
    });

    describe('Multiple values and separators', () => {
        it('should handle comma separators', () => {
            expect(checkWriting('apple', 'apple, banana')).toBe(true);
            expect(checkWriting('banana', 'apple, banana')).toBe(true);
            expect(checkWriting('apple, banana', 'apple, banana')).toBe(true);
        });

        it('should handle semicolon separators', () => {
            expect(checkWriting('apple; banana', 'apple; banana')).toBe(true);
            expect(checkWriting('apple', 'apple; banana')).toBe(true);
            expect(checkWriting('banana', 'apple; banana')).toBe(true);
        });

        it('should return false if one of the entered words is incorrect', () => {
            expect(checkWriting('apple, cherry', 'apple, banana')).toBe(false);
        });
    });

    describe('Specific logic edge cases', () => {
        it('should correctly match words even if separators are different (comma vs semicolon)', () => {
            expect(checkWriting('apple, banana', 'apple; banana')).toBe(true);
        });

        it('should return false for empty strings', () => {
            expect(checkWriting('', '')).toBe(true);
            expect(checkWriting(' ', 'apple')).toBe(false);
        });
    });
});