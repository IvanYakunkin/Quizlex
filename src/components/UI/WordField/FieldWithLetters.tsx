import { memo, useCallback, useState, RefObject, useEffect } from "react";
import { Field } from "./Field";
import { Letters } from "./Letters";

interface FieldWithLettersProps {
    onChange: (value: string, id?: number) => void;
    cardId?: number;
    placeholder?: string;
    language: string;
    value: string;
    ref: RefObject<HTMLInputElement | null>;
    isAlwaysShown?: boolean;
}

export const FieldWithLetters = memo(({
    ref,
    onChange,
    value,
    cardId,
    placeholder,
    language,
    isAlwaysShown,
}: FieldWithLettersProps) => {

    const [isAnimation, setIsAnimation] = useState(false);

    const addLetter = useCallback((letter: string) => {
        const input = ref?.current;
        if (!input) return;

        const start = input.selectionStart ?? value.length;
        const end = input.selectionEnd ?? value.length;

        const newValue = value.slice(0, start) + letter + value.slice(end);

        onChange(newValue, cardId);

        input.focus();
        setTimeout(() => {
            input.setSelectionRange(start + letter.length, start + letter.length);
        }, 0);
    }, [ref, value, onChange, cardId]);

    return (
        <>
            <Field
                ref={ref}
                onFocus={() => setIsAnimation(true)}
                onBlur={() => setIsAnimation(false)}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value, cardId)}
                value={value}
            />
            <Letters
                isAnimation={isAnimation}
                language={language}
                updateValue={addLetter}
                isAlwaysShown={isAlwaysShown}
            />
        </>
    );
});

FieldWithLetters.displayName = "FieldWithLetters";