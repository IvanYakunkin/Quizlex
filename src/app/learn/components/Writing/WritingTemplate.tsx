import { WritingStatus } from "@/types/types";
import { useEffect } from "react";
import { Field } from "@/components/UI/WordField/Field";
import styles from "../../page.module.css";

interface WritingTemplateProps {
    termToShow: string | null;
    inputValue: string;
    onChange: (value: string) => void;
    writingStatus: WritingStatus;
    checkAnswer: () => void;
    progressLabel: string;
}

export const WritingTemplate = ({
    inputValue,
    onChange,
    termToShow,
    writingStatus,
    checkAnswer,
    progressLabel,
}: WritingTemplateProps) => {

    const showAnswer = () => {
        onChange("");
        checkAnswer();
    }

    useEffect(() => {
        const keyboard = (event: KeyboardEvent) => {
            if (event.code === "Enter") {
                checkAnswer();
            }
        }

        window.addEventListener("keydown", keyboard);

        return () => {
            window.removeEventListener("keydown", keyboard);
        }
    }, [checkAnswer]);

    return (
        <div className={styles.container}>

            <div className={styles.progress}>{progressLabel}</div>
            <div className={styles.term}>
                {termToShow || "(empty)"}
            </div>
            <div className="learning__answers">
                <div className={writingStatus === "correct" ? `${styles.answers__title} ${styles.correct}` : styles.answers__title}>
                    {writingStatus === "correct" ? "Correct!" : "Write a translation:"}
                </div>

                <Field
                    autoFocus
                    value={inputValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
                    correct={writingStatus === "correct"}
                />

                <div className={styles.answersBtns}>
                    <div className={styles.answer__nextBtn} onClick={showAnswer}><span>Show answer?</span></div>
                    <div
                        className={writingStatus === "correct" ? `${styles.inputBtn} ${styles.correct}` : styles.inputBtn}
                        onClick={checkAnswer}
                    >
                        {writingStatus === "correct" ? "Correct!" : "Answer"}
                    </div>
                </div>
            </div>

        </div>
    )
}