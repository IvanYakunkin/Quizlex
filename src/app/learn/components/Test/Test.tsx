import { Languages, Card, CardWithClass } from "@/types/types";
import { useState, useEffect, useRef, useCallback } from "react";
import ResultPage from "../ResultPage";
import { shuffleCards, getRandomInt, playSound } from "@/utils/common";
import TestOptions from "./TestOptions";
import styles from "../../page.module.css";

interface TestProps {
    cards: Card[];  
    changeLanguage: boolean;
    languages: Languages;
}
interface AnswerResultOptions{
    class: string;
    value: string;
}

type AnswerOptionsClasses = Record<string, string>;
type AnswerResult = "incorrect" | "correct" | "showAnswer" | "";
type TestAnswerId = -1|0|1|2|3;

const templateOptions = {
    default: {value: "Choose the correct answer:", class: ""},
    correct: {value: "Correct!", class: "correct"},
    incorrect: {value: "Incorrect!", class: "incorrect"},
    showAnswer: {value: "Answer this question later", class: "showAnswer"}
}

const optionsClasses: AnswerOptionsClasses = {
    correct: "correct",
    incorrect: "incorrect",
    inactive: "inactive",
};

const deniedKeys = [
  "Shift", "Control", "Alt", "Meta", "Tab", "CapsLock", "Escape", "NumLock",
  "ScrollLock", "Pause", "Insert", "Delete", "Home", "End", "PageUp", "PageDown",
  "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "ContextMenu", "F1", "F2", "F3",
  "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "PrintScreen"
];

const wordsPerRound = 10;
const switchCorrectCardDuration = 600;

const Test = (props: TestProps) => {

    const [testCards, setTestCards] = useState<Card[]>(shuffleCards(props.cards)); // These are terms that remain to be answered
    const [answeredCards, setAnsweredCards] = useState<Card[]>([]); // Per round
    const [currentCard, setCurrentCard] = useState<Card>(testCards[0]);
    const [answerStatus, setAnswerStatus] = useState<AnswerResult>("");
    const [answerOptions, setAnswerOptions] = useState<CardWithClass[]>([]);
    const [showResultPage, setShowResultPage] = useState(false);

    const correctAnswerPosition = useRef(0); 
    const answerTemplateOptions = useRef<AnswerResultOptions>(templateOptions.default);
    const wordsRoundCounter = useRef(0);
    
    const answersNumber = props.cards.length > 3 ? 4 : props.cards.length;

    const checkAnswer = useCallback((id: TestAnswerId) => {
        if(answerStatus) return;
        //Set classes for options elements
        for(let i = 0; i < answerOptions.length; i++){
            if(i === id && answerOptions[i].id !== currentCard.id){
                answerOptions[i].class = optionsClasses.incorrect;
                answerTemplateOptions.current = templateOptions.incorrect;
                setAnswerStatus("incorrect");
            }
            else if(i === correctAnswerPosition.current){
                answerOptions[i].class = optionsClasses.correct;

                if(i === id){
                    answerTemplateOptions.current = templateOptions.correct;
                    setAnswerStatus("correct");
                }
            }
            else{
                // For giving up 
                if(id < 0){
                    answerTemplateOptions.current = templateOptions.showAnswer;
                    setAnswerStatus("showAnswer");
                }
                
                answerOptions[i].class = optionsClasses.inactive;
            }
        }
    }, [answerOptions, answerStatus, currentCard]);

    const toNextWord = useCallback(() => {
        let updatedTestCards = testCards.slice();

        if(answerStatus === "correct"){
            // remove the correct word from the collection 
            updatedTestCards.shift();            
            wordsRoundCounter.current++;
            setAnsweredCards([...answeredCards, currentCard]);
            
        }else{
            updatedTestCards = shuffleCards(testCards)
        }

        // Show the result page
        if(wordsRoundCounter.current === wordsPerRound){
            setShowResultPage(true);
            wordsRoundCounter.current = 0;
        }

        setAnswerStatus("");
        setTestCards(updatedTestCards);
        setCurrentCard(updatedTestCards[0]);
        answerTemplateOptions.current = templateOptions.default;

    }, [testCards, answerStatus, currentCard, answeredCards]);

    // Set answer options
    useEffect(() => {
        if(!testCards || !currentCard) return;
        const localOptions: CardWithClass[] = [];
        correctAnswerPosition.current = getRandomInt(0, answersNumber);
        
        for(let i = 0; i < answersNumber; i++){
            let newOption: Card = {id: 0, term: "", definition: "", isFavorite: false};
            // Add correct answer card
            if(i === correctAnswerPosition.current){
                newOption = currentCard;
            }else{

                // Trying to generate unique incorrect answer options
                let isGenerating = true;
                let incorrectAnswerId: number;
                loop: while(isGenerating){

                    incorrectAnswerId = getRandomInt(0, props.cards.length);

                    for(let v = 0; v < localOptions.length; v++){
                        if(localOptions[v].id === props.cards[incorrectAnswerId].id){
                            continue loop;
                        }
                    }

                    // Push only if it is an incorrect option
                    if(props.cards[incorrectAnswerId].id !== currentCard.id){
                        newOption = props.cards[incorrectAnswerId];
                        isGenerating = false;    
                    }   
                }
            }
            localOptions.push({...newOption, class:optionsClasses.default});
        }

        setAnswerOptions(localOptions);

    }, [answersNumber, testCards, currentCard, props.cards]);
    
    // Keyboard
    useEffect(() => {        
        const keyboard = (event: KeyboardEvent) => {
            if(answerStatus === "incorrect" || answerStatus === "showAnswer"){
                if(event.code && !deniedKeys.includes(event.key)){
                    setTimeout(() => {
                        toNextWord();
                    }, 0);
                }
            }
            if(Number(event.key) > 0 && Number(event.key) <= 4){
                checkAnswer((Number(event.key) - 1) as TestAnswerId);
            }
        }

        if(answerStatus === "correct"){
            setTimeout(() => {
                toNextWord();
            }, switchCorrectCardDuration);
        }
        
        window.addEventListener("keydown", keyboard);
      
        return () => {
            window.removeEventListener("keydown", keyboard);
        }
        
    }, [answerStatus, answerOptions, checkAnswer, toNextWord]);


    const wordsCounterLabel = props.cards.length - testCards.length + 1 + " / " + props.cards.length;

    const testOptions = (
        <TestOptions
            currentCard={currentCard} 
            answerOptions={answerOptions} 
            selectionHandler={checkAnswer} 
            testTitleOptions={answerTemplateOptions} 
            changeLanguage={props.changeLanguage}
            isNextBtn = {answerStatus !== "" && answerStatus !== "correct"}
            toNextWord={toNextWord}
        />
    );

    const resultsTemplate = (
        <ResultPage 
            cards={answeredCards} 
            setCards={setAnsweredCards}
            closeResultPage = {() => {setShowResultPage(false);setAnsweredCards([])}} 
            isGameOver = {showResultPage && testCards.length === 0}
            language = {props.languages.term}
        />
    );

    const wordClick = () => {
        const word = props.changeLanguage ? currentCard.definition : currentCard.term;
        const language = props.changeLanguage ? props.languages.definition : props.languages.term;
        if(word){
            playSound(word, language);
        }
    }

    return (
        <div>
            {testCards.length !== 0 && !showResultPage ?
            <div>
                <div className={styles.container}>
                    <div className={styles.progress}>{wordsCounterLabel}</div>
                    <div className={styles.term} >
                        <span onClick={wordClick}>{props.changeLanguage ? currentCard.definition : currentCard.term}</span>
                    </div>
                        {testOptions}
                </div>
            </div>
            : resultsTemplate}
        </div>
    )
}

export default Test;