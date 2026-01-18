import { describe, it, expect, vi, afterAll, beforeEach } from 'vitest';
import { createModuleDB, CreateModuleDBParams, createModuleLS } from './createModule';
import { Languages } from '@/types/types';
import { Card } from '@/generated/prisma/browser';

describe('createModule logic', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    it('should save module to localStorage', () => {
        const cards = [{ id: 1, term: 'Apple', definition: 'Яблоко' }];
        const langs = { term: 'en', definition: 'ru' };

        const result = createModuleLS(cards as Card[], langs as Languages);

        expect(localStorage.getItem('module')).toContain('Apple');
        expect(result.languages.term).toBe('en');
    });

    it('should send correct data to /api/modules', async () => {
        const mockFetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ id: 123 }),
        });

        vi.stubGlobal('fetch', mockFetch);

        const params = {
            name: 'Test',
            description: 'Desc',
            cards: [],
            languages: [{ id: 10, name: "English", code: 'en' }],
            selectedLanguages: { term: 'en', definition: 'ru' }
        };

        await createModuleDB(params as CreateModuleDBParams);

        const bodyString = mockFetch.mock.calls[0][1]?.body;
        if (typeof bodyString !== 'string') {
            throw new Error('Fetch body is missing');
        }
        const callArgs = JSON.parse(bodyString);

        expect(callArgs.module.termLanguageId).toBe(10);
        expect(callArgs.module.definitionLanguageId).toBe(1);
    });

    afterAll(() => {
        vi.unstubAllGlobals();
    });
});