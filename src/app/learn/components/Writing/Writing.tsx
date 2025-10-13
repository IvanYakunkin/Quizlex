import { Languages, Card, WritingResultStatus } from "@/types/types";
import { shuffleCards } from "@/utils/common";
import { useState, useRef, useEffect, useCallback, JSX } from "react";
import WritingTemplate from "./WritingTemplate";
import WritingMistakePage from "./WritingMistakePage";
import ResultPage from "../ResultPage";

interface WritingProps{
    cards: Card[];
    changeLanguage: boolean;
    languages: Languages;
}

const successTimerDuration = 600;
const maxWordsPerRound = 10;

const Writing = (props: WritingProps) => {
    const [answeredCards, setAnsweredCards] = useState<Card[]>([]); // Per round
    const [result, setResult] = useState<WritingResultStatus>("");
    const [testCards, setTestCards] = useState<Card[]>(shuffleCards(props.cards));
    const [currentCard, setCurrentCard] = useState<Card>(testCards[0]);

    const inputRef = useRef<HTMLInputElement>(null);
    const wordsRoundCounter = useRef(0);

    const progressLabel = props.cards.length - testCards.length + 1 + " / " + props.cards.length;

    const [currentTemplate, setCurrentTemplate] = useState<JSX.Element>(
        <WritingTemplate 
            inputRef={inputRef} 
            currentCard={currentCard}
            setResult={setResult}
            result={result}
            progressLabel={progressLabel}
            changeLanguage={props.changeLanguage}
        />  
    );

    // Returns the value for setResult and set some properties for the next page
    const toNextCorrect = useCallback(() => { 
        if(inputRef.current){
            inputRef.current.value = "";
        }

        const testCardsLocal = testCards.slice(1);

        setTestCards(testCardsLocal);
        setAnsweredCards([...answeredCards, currentCard]);
        wordsRoundCounter.current++;
        
        // Finish
        if(testCardsLocal.length === 0){
            return "finished";
        }

        setCurrentCard(testCardsLocal[0]);
        
        if(wordsRoundCounter.current === maxWordsPerRound){
            wordsRoundCounter.current = 0;
            return "result";
        }

        return "";
    }, [currentCard, testCards, answeredCards]);

    useEffect(() => {
        if(result === "correct"){

            const successTimer = setTimeout(() => {
                setResult(toNextCorrect());
            }, successTimerDuration);

            return () => clearTimeout(successTimer);

        }else if(result === "incorrect"){
            const testCardsLocal = shuffleCards(testCards);
            
            setTestCards(testCardsLocal);
            setCurrentCard(testCardsLocal[0]);            
            setResult(""); 
        }else if(result === "correctForce"){
            setResult(toNextCorrect());
        }

        setTimeout(() => {
            inputRef.current?.focus();
        }, 1);

    }, [result, testCards, toNextCorrect]);

    const writingPage = useCallback(() => (
        <WritingTemplate 
            inputRef={inputRef} 
            currentCard={currentCard}
            setResult={setResult}
            result={result}
            progressLabel={progressLabel}
            changeLanguage={props.changeLanguage}
        />
    ), [inputRef, currentCard, setResult, result, progressLabel, props.changeLanguage]);

    const writingMistakePage = useCallback(() => (
        <WritingMistakePage 
            currentCard={currentCard}
            enteredAnswer={inputRef.current?.value}
            setResult={setResult}
            result={result}
            changeLanguage={props.changeLanguage}
        />
    ), [currentCard, inputRef, setResult, result, props.changeLanguage]);

    const resultPage = useCallback(() => (
        <ResultPage 
            cards={answeredCards} 
            setCards={setAnsweredCards}
            closeResultPage={() => {setResult(""); setAnsweredCards([])}} 
            isGameOver={result === "finished"}
            language={props.languages.term}
        />
    ), [answeredCards, setAnsweredCards, result, props.languages.term]);

    // Define the template to show
    useEffect(() => {
        switch (result) {
            case "correct":
            case "":
                setCurrentTemplate(writingPage);
                break;
            case "finished":
                setCurrentTemplate(resultPage);
                break;
            case "empty":
            case "mistake":
                setCurrentTemplate(writingMistakePage);
                break;
            case "result":
                setCurrentTemplate(resultPage);
                break;
            default: 
                break;
        }

    }, [result, currentCard, writingPage, writingMistakePage, resultPage]);

    return (
        <div className="writing-container">
            {currentTemplate}
        </div>
    )
}


export default Writing;