import { Card } from "@/types/types";
import { useCallback, useEffect, useRef } from "react";
import { Field } from "@/components/UI/WordField/Field";
import styles from "../../page.module.css";
import { checkWriting } from "@/utils/cards/checkWriting";

interface WritingMistakePageProps {
    currentCard: Card;
    enteredAnswer: string | undefined;
    toNextWord: (isCorrect?: boolean) => void;
    changeLanguage: boolean;
}

export const WritingMistakePage = ({
    currentCard,
    enteredAnswer,
    toNextWord,
    changeLanguage,
}: WritingMistakePageProps) => {

    const inputRef = useRef<HTMLInputElement>(null);
    const checkAnswer = useCallback(() => {
        if (inputRef.current) {
            const correctAnswer = changeLanguage ? currentCard.term : currentCard.definition;
            const isCorrectResult = checkWriting(inputRef.current.value, correctAnswer || "");
            if (isCorrectResult) {
                toNextWord();
            }
        }
    }, [changeLanguage, currentCard, toNextWord]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        const keyboard = (event: KeyboardEvent) => {
            const isAnswerEmpty = enteredAnswer?.trim() === "";
            if (event.code === "Enter") {
                if (!isAnswerEmpty) {
                    toNextWord();
                } else {
                    checkAnswer();
                }
            } else if (event.code === "Space" && !isAnswerEmpty) {
                toNextWord();
            } else if (event.code === "Digit2" && !isAnswerEmpty) {
                toNextWord(true);
            }
        }

        window.addEventListener("keydown", keyboard);

        return () => {
            window.removeEventListener("keydown", keyboard);
        }
    }, [checkAnswer, enteredAnswer, toNextWord]);

    return (
        <div className="learning-result">
            <div className={styles.writingResult}>
                <div className={styles.result__title}>Wrong!</div>
                <div className={`${styles.result__block} ${styles.term}`}>
                    <div>{changeLanguage ? currentCard.definition : currentCard.term}</div>
                </div>
                <div className={styles.result__answers}>
                    {enteredAnswer?.trim() !== "" &&
                        <div className={`${styles.result__block} ${styles.incorrect}`}>
                            <label className={styles.result__blockLabel}>Your answer:</label>
                            <div>{enteredAnswer}</div>
                        </div>
                    }
                    <div className={`${styles.result__block} ${styles.correct}`}>
                        <label className={styles.result__blockLabel}>Correct answer:</label>
                        <div>{changeLanguage ? currentCard.term : currentCard.definition}</div>
                    </div>
                </div>
                <div className={styles.result__blockRewrite}>
                    {(enteredAnswer?.trim() === "" &&
                        <div className={styles.result__blockWriting}>
                            <Field ref={inputRef} placeholder="Enter the correct answer:" />
                            <div className={`${styles.inputBtn} ${styles.mistake}`} onClick={checkAnswer}>Answer</div>
                        </div>
                    )
                        ||
                        <div className={styles.writingResult__btns}>
                            <div className={styles.writingNext} onClick={() => toNextWord()}><span className="desktop">Press SPACE to continue</span><span className="mobile">Continue</span></div>
                            <div className={styles.writingNextCorrect} onClick={() => toNextWord(true)}>It&apos;s correct</div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}