import { describe, expect, it, vi } from "vitest";
import { render, screen } from '@testing-library/react';
import { Slider, SliderRef } from "./Slider";
import { BaseCard } from "@/types/module";

vi.mock('next-auth/react', () => ({
    useSession: vi.fn(() => ({
        data: { user: { name: 'Test User', id: '123' } },
        status: 'authenticated',
    })),
    SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('next/navigation', () => ({
    useParams: vi.fn(() => ({ id: '1' })),
}));

describe('Slider Component', () => {
    const mockSetCards = vi.fn();
    const mockSetCurrentCardId = vi.fn();

    const mockCards: BaseCard[] = [
        { id: 1, isFavorite: false, term: 'test value 001', definition: "aa" },
        { id: 2, isFavorite: true, term: 'b', definition: "bb" },
        { id: 3, isFavorite: false, term: 'c', definition: "cc" },
        { id: 4, isFavorite: false, term: 'd', definition: "dd" },
        { id: 5, isFavorite: false, term: 'e', definition: "ee" },
        { id: 6, isFavorite: false, term: 'f', definition: "ff" },
        { id: 7, isFavorite: false, term: 'g', definition: "gg" },
        { id: 8, isFavorite: false, term: 'h', definition: "hh" },
    ];
    const mockLanguages = { term: 'en', definition: 'ru' };

    it('should render the current card term', () => {
        const mockSliderRef = {
            current: {
                scrollNext: vi.fn(),
                scrollPrev: vi.fn()
            }
        };

        render(
            <Slider
                cards={mockCards}
                languages={mockLanguages}
                changeCards={mockSetCards}
                currentCardId={0}
                setCurrentCardId={mockSetCurrentCardId}
                sliderRef={mockSliderRef as unknown as React.RefObject<SliderRef>}
            />
        );

        expect(screen.getByText('test value 001')).toBeDefined();
    });
});