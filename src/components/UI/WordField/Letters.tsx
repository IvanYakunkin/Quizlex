import { memo, useEffect, useRef, useState } from "react";
import styles from "./WordField.module.css";
import { lettersDictionary } from "@/utils/lettersDictionary/lettersDictionary";

interface LettersProps {
    isAnimation?: boolean;
    language: string;
    updateValue: (replaceTo: string) => void;
    isAlwaysShown?: boolean;
}

export const Letters = memo((props: LettersProps) => {
    const [isUpperCase, setIsUpperCase] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const letters = lettersDictionary[props.language];

    const putLetter = (letter: string) => {
        props.updateValue(isUpperCase ? letter.toUpperCase() : letter.toLowerCase());
    }

    useEffect(() => {
        setTimeout(() => {
            if (containerRef.current) {
                if (props.isAnimation) {

                    const scrollHeight = containerRef.current.scrollHeight;

                    requestAnimationFrame(() => {
                        if (containerRef.current) containerRef.current.style.height = `${scrollHeight}px`;
                    });
                } else {
                    if (containerRef.current) containerRef.current.style.height = '0';
                }
            }
        });
    }, [props.isAnimation]);

    return (
        <div className={`${styles.container} desktop`} ref={containerRef}>
            {letters.length > 0 && (
                <div className={styles.letters} onMouseDown={(e) => e.preventDefault()}>
                    {letters.map((l, key) => (
                        <div className={styles.letterOne} onClick={() => putLetter(l)} key={key}>{isUpperCase ? l.toUpperCase() : l.toLowerCase()}</div>
                    ))}

                    <div className={styles.letterOne} onClick={() => setIsUpperCase(!isUpperCase)}>^</div>
                </div>
            )}
        </div>
    );
});

Letters.displayName = "Letters";