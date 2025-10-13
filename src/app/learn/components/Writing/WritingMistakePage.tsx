import { Card, WritingResultStatus } from "@/types/types";
import { useCallback, useEffect, useRef } from "react";
import { checkWriting } from "@/utils/common";
import Field from "@/components/UI/WordField/Field";
import styles from "../../page.module.css";

interface WritingMistakePageProps{
    currentCard: Card;
    enteredAnswer: string | undefined;
    setResult: React.Dispatch<React.SetStateAction<WritingResultStatus>>;
    result: string;
    changeLanguage: boolean;
}

const WritingMistakePage = (props: WritingMistakePageProps) => {

    const inputRef = useRef<HTMLInputElement>(null);

    const checkAnswer = useCallback(() => {
        if(inputRef.current){
            const correctAnswer = props.changeLanguage ? props.currentCard.term : props.currentCard.definition;
            const result: boolean = checkWriting(inputRef.current.value, correctAnswer);
            
            if(result) return props.setResult("incorrect");
        }        
    }, [props]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        const keyboard = (event: KeyboardEvent) => {
            if(event.code === "Enter" || (props.result === "mistake" && event.code === "Space")){
                event.preventDefault();
                if(props.result !== "mistake"){
                    checkAnswer();
                }else{
                    props.setResult("incorrect");
                }
            }
            else if(event.code === "Digit2" && props.result === "mistake"){
                event.preventDefault();
                props.setResult("correctForce");
            }
        }

        window.addEventListener("keydown", keyboard);

        return () => {
            window.removeEventListener("keydown", keyboard);
        }
    }, [props, checkAnswer]);

    return (
        <div className="learning-result">
            <div className={styles.writingResult}>
                <div className={styles.result__title}>Wrong!</div>
                <div className={`${styles.result__block} ${styles.term}`}>
                    <div>{props.changeLanguage ? props.currentCard.definition : props.currentCard.term}</div>
                </div>
                <div className={styles.result__answers}>
                    { props.result !== "mistake" || 
                    <div className={`${styles.result__block} ${styles.incorrect}`}>
                        <label className={styles.result__blockLabel}>Your answer:</label>
                        <div>{props.enteredAnswer}</div>
                    </div> 
                    }
                    <div className={`${styles.result__block} ${styles.correct}`}>
                        <label className={styles.result__blockLabel}>Correct answer:</label>
                        <div>{props.changeLanguage ? props.currentCard.term : props.currentCard.definition}</div>
                    </div>
                </div>
                <div className={styles.result__blockRewrite}>
                    {(props.result !== "mistake" && 
                    <div className={styles.result__blockWriting}>
                        <Field ref={inputRef} placeholder="Enter the correct answer:"/>
                        <div className={`${styles.inputBtn} ${styles.mistake}`} onClick={checkAnswer}>Answer</div>
                    </div>
                    )
                    ||
                    <div className={styles.writingResult__btns}>
                        <div className={styles.writingNext} onClick={() => props.setResult("incorrect")}><span className="desktop">Press SPACE to continue</span><span className="mobile">Continue</span></div>
                        <div className={styles.writingNextCorrect} onClick={() => props.setResult("correctForce")}>It&apos;s correct</div>
                    </div>
                }
                </div>

            </div>

        </div>
        )
}

export default WritingMistakePage;