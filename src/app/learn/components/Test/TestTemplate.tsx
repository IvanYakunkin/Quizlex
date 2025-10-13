import { Card } from "@/types/types";
import { playSound } from "@/utils/common";
import styles from "../../page.module.css";
import { CardWithClass } from "@/types/types";

interface TestTemplateProps{
    currentCard: Card;
    wordsCounterLabel: string;
    answerOptions: CardWithClass[];
    selectionHandler: (key: number) => void;
    testTitleOptions: React.RefObject<{value: string; class: string;}>;
    changeLanguage: boolean;
    language: string;
}

const TestTemplate = (props:TestTemplateProps) => {
    const answerOptionsTemplate = props.answerOptions.map((el, key) => (
        <div className={el.class} key={el.id} onClick={() => props.selectionHandler(key)}><span>{key + 1}. </span>{props.changeLanguage ? el.term : el.definition}</div>
    ));

    const currentTerm = props.changeLanguage ? props.currentCard.definition : props.currentCard.term;

    const wordClick = () => {
        if(currentTerm){
            playSound(currentTerm, props.language);
        }
    }

    return (
        <div className="learning-container">
            <div className={styles.progress}>{props.wordsCounterLabel}</div>
            <div className={styles.term} >
                <span onClick={wordClick}>{currentTerm}</span>
            </div>
            <div className={styles.answers}>
                <div className={styles[props.testTitleOptions.current.class] ? styles.answers__title + " " + props.testTitleOptions.current.class : styles.answers__title}>
                    {props.testTitleOptions.current.value}
                </div>
                <div className={styles.answers__btns}>
                    {answerOptionsTemplate}
                </div>
                <div className={`${styles.answers__giveUp} ${styles.center}`} onClick={() => props.selectionHandler(-1)}>
                    Show answer?
                </div>
            </div>       
        </div>
    )
}

export default TestTemplate;