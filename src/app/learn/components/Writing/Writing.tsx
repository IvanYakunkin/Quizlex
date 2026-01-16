import { Languages, Card, WritingStatus } from "@/types/types";
import { useState, useRef } from "react";
import { WritingTemplate } from "./WritingTemplate";
import { WritingMistakePage } from "./WritingMistakePage";
import ResultPage from "../ResultPage";
import { getRandomInt } from "@/utils/cards/shuffleCards";
import { checkWriting } from "@/utils/cards/checkWriting";

interface WritingProps {
    cards: Card[];
    changeLanguage: boolean;
    languages: Languages;
}

const successTimerDuration = 600;
const maxWordsPerRound = 10;

export const Writing = (props: WritingProps) => {
    const [testCards, setTestCards] = useState<Card[]>(props.cards);
    const [answeredCards, setAnsweredCards] = useState<Card[]>([]); // Per round
    const [writingStatus, setWritingStatus] = useState<WritingStatus>("");
    const [currentCard, setCurrentCard] = useState<Card>(props.cards[getRandomInt(0, props.cards.length - 1)]);
    const [inputValue, setInputValue] = useState("");

    const wordsRoundCounter = useRef(0);

    const progressLabel = props.cards.length - testCards.length + 1 + " / " + props.cards.length;

    const toNextWord = (isCorrect?: boolean) => {
        if (!isCorrect) {
            setCurrentCard(testCards[getRandomInt(0, testCards.length - 1)]);
            setWritingStatus("");
        } else {
            if (testCards.length === 1) {
                setWritingStatus("finished");
                setAnsweredCards([...answeredCards, currentCard]);
            }
            else {
                const localTestCards = testCards.filter(card => card.id !== currentCard.id);
                setTestCards(localTestCards);
                setAnsweredCards([...answeredCards, currentCard]);
                wordsRoundCounter.current++;

                setCurrentCard(localTestCards[getRandomInt(0, localTestCards.length - 1)]);
                setWritingStatus("");

                if (wordsRoundCounter.current === maxWordsPerRound) {
                    wordsRoundCounter.current = 0;
                    setWritingStatus("result");
                }
            }

        }
        setInputValue("");
    }

    const checkAnswer = () => {
        const correctAnswer = props.changeLanguage ? currentCard.term : currentCard.definition;
        const isAnswerCorrect = checkWriting(inputValue, correctAnswer || "");

        if (isAnswerCorrect) {
            setWritingStatus("correct");
            const successTimer = setTimeout(() => {
                toNextWord(true);
            }, successTimerDuration);

            return () => clearTimeout(successTimer);
        } else if (inputValue.trim() === "") {
            setWritingStatus("empty");
        }
        else {
            setWritingStatus("mistake");
        }
    }
    return (
        <div className="writing-container">
            {(writingStatus === "correct" || writingStatus === "") &&
                <WritingTemplate
                    inputValue={inputValue}
                    onChange={(value: string) => setInputValue(value)}
                    termToShow={props.changeLanguage ? currentCard.definition : currentCard.term}
                    checkAnswer={checkAnswer}
                    writingStatus={writingStatus}
                    progressLabel={progressLabel}
                />
            }
            {(writingStatus === "finished" || writingStatus === "result") &&
                <ResultPage
                    cards={answeredCards}
                    setCards={setAnsweredCards}
                    closeResultPage={() => { setWritingStatus(""); setAnsweredCards([]) }}
                    title={writingStatus === "finished" ? "Congratulations! You have completed the module!" : ""}
                    isGameOver={writingStatus === "finished"}
                    language={props.languages.term}
                />
            }
            {(writingStatus === "empty" || writingStatus === "mistake") &&
                <WritingMistakePage
                    currentCard={currentCard}
                    enteredAnswer={inputValue}
                    changeLanguage={props.changeLanguage}
                    toNextWord={toNextWord}
                />
            }
        </div>
    );
}