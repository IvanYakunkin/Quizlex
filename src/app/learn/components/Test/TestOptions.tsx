import { Card, CardWithClass } from "@/types/types";
import styles from "../../page.module.css";

type TestAnswerId = -1|0|1|2|3;

interface TestOptionsProps {
    answerOptions: CardWithClass[];
    selectionHandler: (key: TestAnswerId) => void;
    changeLanguage: boolean;
    currentCard: Card;
    testTitleOptions: React.RefObject<{value: string; class: string;}>;
    isNextBtn: boolean;
    toNextWord: () => void;
}

const TestOptions = (props: TestOptionsProps) => {

    const answerOptionsTemplate = props.answerOptions.map((el, key) => (
        <div className={styles.answer__btn + " " + styles[el.class]} key={el.id} onClick={() => props.selectionHandler(key as TestAnswerId)}><span>{key + 1}. </span>{props.changeLanguage ? el.term : el.definition}</div>
    ));

    return (
        <div className={styles.answers}>
            <div className={props.testTitleOptions.current.class ? styles.answers__title + " " + styles[props.testTitleOptions.current.class] : styles.answers__title}>
                {props.testTitleOptions.current.value}
            </div>
            <div className={styles.answers__btns}>
                {answerOptionsTemplate}
            </div>

            {props.isNextBtn ? 
            <div className={`${styles.answer__nextBtn} ${styles.center}`}>
                <span className="desktop" onClick={props.toNextWord}>Press any key to continue</span>
                <span className="mobile" onClick={props.toNextWord}>Press to continue</span>
            </div>    
            :
            <div className={`${styles.answer__nextBtn} ${styles.center}`}>
                <span onClick={() => props.selectionHandler(-1)}>Show answer?</span>
            </div>    
        }
           
        </div>       
    )
}

export default TestOptions;