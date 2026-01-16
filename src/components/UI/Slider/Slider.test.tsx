import { describe, expect, it, vi } from "vitest";
import { render, screen } from '@testing-library/react';
import { Slider, SliderRef } from "./Slider";

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

    const mockCards = [
        { id: 1, term: 'Apple', definition: 'Яблоко' },
        { id: 2, term: 'Banana', definition: 'Банан' }
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
                setCards={mockSetCards}
                currentCardId={0}
                setCurrentCardId={mockSetCurrentCardId}
                sliderRef={mockSliderRef as unknown as React.RefObject<SliderRef>}
            />
        );

        expect(screen.getByText('Apple')).toBeDefined();
    });
});