import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useWritingLogic } from './useWritingLogic';

vi.mock('@/utils/cards/shuffleCards', () => ({
    getRandomInt: vi.fn(() => 0),
}));

const mockCards = [
    { id: 1, term: 'Hund', definition: 'Dog', moduleId: 101 },
    { id: 2, term: 'Katze', definition: 'Cat', moduleId: 101 },
];

describe('useWritingLogic', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    it('must be initialized with the first card', () => {
        const { result } = renderHook(() => useWritingLogic({
            cards: mockCards,
            changeLanguage: false
        }));

        expect(result.current.state.currentCard).toEqual(mockCards[0]);
    });

    it('should change status to "correct" when input is correct', () => {
        const { result } = renderHook(() => useWritingLogic({
            cards: mockCards,
            changeLanguage: false
        }));

        act(() => {
            result.current.actions.setInputValue('Dog');
        });

        act(() => {
            result.current.actions.checkAnswer();
        });

        expect(result.current.state.writingStatus).toBe('correct');
    });

    it('must add the card to answeredCards after success and timer', async () => {
        const { result } = renderHook(() => useWritingLogic({
            cards: mockCards,
            changeLanguage: false,
            successTimerDuration: 500
        }));

        act(() => {
            result.current.actions.setInputValue('Dog');
        });

        act(() => {
            result.current.actions.checkAnswer();
        });

        expect(result.current.state.writingStatus).toBe('correct');

        act(() => {
            vi.advanceTimersByTime(500);
        });

        act(() => {
            vi.runAllTicks();
        });

        expect(result.current.state.answeredCards).toHaveLength(1);
        expect(result.current.state.answeredCards[0].id).toBe(1);
        expect(result.current.state.testCards).toHaveLength(mockCards.length - 1);
    });
    it('должен переходить в статус "finished", когда последняя карточка отвечена верно', async () => {
        const singleCard = [mockCards[0]];

        const { result } = renderHook(() => useWritingLogic({
            cards: singleCard,
            changeLanguage: false,
            successTimerDuration: 500
        }));

        act(() => {
            result.current.actions.setInputValue('Dog');
        });

        act(() => {
            result.current.actions.checkAnswer();
        });

        expect(result.current.state.writingStatus).toBe('correct');

        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(result.current.state.writingStatus).toBe('finished');
        expect(result.current.state.testCards).toHaveLength(0);
    });

    it('should switch to the "result" status exactly after maxWordsPerRound responses', async () => {
        const manyCards = Array.from({ length: 5 }, (_, i) => ({
            id: i,
            term: `term${i}`,
            definition: `def${i}`,
            moduleId: 1
        }));

        const { result } = renderHook(() => useWritingLogic({
            cards: manyCards,
            maxWordsPerRound: 3,
            changeLanguage: false,
            successTimerDuration: 500
        }));

        for (let i = 0; i < 3; i++) {
            const currentDef = result.current.state.currentCard?.definition;

            await act(async () => {
                result.current.actions.setInputValue(currentDef || "");
            });

            await act(async () => {
                result.current.actions.checkAnswer();
            });

            await act(async () => {
                vi.advanceTimersByTime(500);
            });
        }

        expect(result.current.state.writingStatus).toBe('result');
        expect(result.current.state.answeredCards).toHaveLength(3);
    });
});