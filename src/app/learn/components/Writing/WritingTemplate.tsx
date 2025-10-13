import { Card, WritingResultStatus } from "@/types/types";
import { useCallback, useEffect } from "react";
import { checkWriting } from "@/utils/common";
import Field from "@/components/UI/WordField/Field";
import styles from "../../page.module.css";

interface WritingTemplateProps{
    inputRef: React.RefObject<HTMLInputElement|null>;
    currentCard: Card;
    result: WritingResultStatus;
    setResult: React.Dispatch<React.SetStateAction<WritingResultStatus>>;
    progressLabel: string;
    changeLanguage: boolean;
}

const WritingTemplate = (props: WritingTemplateProps) => {
    
    const checkAnswer = useCallback(() => {
        if(props.inputRef.current){
            const correctAnswer = props.changeLanguage ? props.currentCard.term : props.currentCard.definition;
            const result = checkWriting(props.inputRef.current.value, correctAnswer);

            if(result){
                return props.setResult("correct");
            }else if(props.inputRef.current.value.trim() === ""){
                return props.setResult("empty");
            }
        }
                
        return props.setResult("mistake");
    }, [props]);

    useEffect(() => {
        const keyboard = (event: KeyboardEvent) => {
            if(event.code === "Enter"){
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
            
            <div className={styles.progress}>{props.progressLabel}</div>
            <div className={styles.term}>
                {props.changeLanguage ? props.currentCard.definition : props.currentCard.term}
            </div>
            <div className="learning__answers">
                <div className={props.result === "correct" ? `${styles.answers__title} ${styles.correct}` : styles.answers__title}>
                    {props.result === "correct" ? "Correct!" : "Write a translation:"}
                </div>

                <Field 
                    ref={props.inputRef}
                    correct={props.result === "correct"}
                />
                
                <div className={styles.answersBtns}>
                    <div className={styles.answer__nextBtn} onClick={() => props.setResult("empty")}><span>Show answer?</span></div>
                    <div className={props.result === "correct" ? `${styles.inputBtn} ${styles.correct}`: styles.inputBtn} onClick={checkAnswer}>{props.result === "correct" ? "Correct!" : "Answer"}</div>
                </div>
            </div>
            
        </div>
    )
}

export default WritingTemplate;