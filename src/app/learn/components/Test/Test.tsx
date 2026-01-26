import { Languages, StudySettings } from "@/types/types";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ResultPage } from "../ResultPage";
import { TestOptions } from "./TestOptions";
import { getRandomInt } from "@/utils/cards/shuffleCards";
import { playSound } from "@/utils/audio/playSound";
import { BaseCard, CardWithClass } from "@/types/module";
import styles from "../../page.module.css";

interface TestProps {
    cards: BaseCard[];
    languages: Languages;
    settings: StudySettings;
}

interface AnswerResultOptions {
    class: string;
    value: string;
}

type AnswerOptionsClasses = Record<string, string>;
type AnswerResult = "incorrect" | "correct" | "showAnswer" | "";
type TestAnswerId = -1 | 0 | 1 | 2 | 3;

const templateOptions = {
    default: { value: "Choose the correct answer:", class: "" },
    correct: { value: "Correct!", class: "correct" },
    incorrect: { value: "Incorrect!", class: "incorrect" },
    showAnswer: { value: "Answer this question later", class: "showAnswer" }
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

const switchCorrectCardDuration = 600;

export const Test = (props: TestProps) => {
    const [testCards, setTestCards] = useState<BaseCard[]>(props.cards); // These are terms that remain to be answered
    const [answeredCards, setAnsweredCards] = useState<BaseCard[]>([]); // Per round
    const [currentCard, setCurrentCard] = useState<BaseCard>(testCards[0]);
    const [answerStatus, setAnswerStatus] = useState<AnswerResult>("");
    const [answerOptions, setAnswerOptions] = useState<CardWithClass[]>([]);
    const [showResultPage, setShowResultPage] = useState(false);

    const correctAnswerPosition = useRef(0);
    const answerTemplateOptions = useRef<AnswerResultOptions>(templateOptions.default);
    const wordsRoundCounter = useRef(0);
    // use it in effect for generating new testCards when props.cards was changed
    const currentIdRef = useRef(currentCard.id);

    const wordsPerRound = useMemo(() => {
        if (props.settings.wordsPerRound && props.settings.wordsPerRound < props.cards.length) {
            return props.settings.wordsPerRound;
        }
        return 10;
    }, [props.settings.wordsPerRound, props.cards.length]);

    const answersNumber = props.cards.length > 3 ? 4 : props.cards.length;
    const isFrontLanguageChanged = props.settings.frontLanguage.id !== props.languages.term.id;

    const checkAnswer = useCallback((id: TestAnswerId) => {
        if (answerStatus) return;
        //Set classes for options elements
        for (let i = 0; i < answerOptions.length; i++) {
            if (i === id && answerOptions[i].id !== currentCard.id) {
                setAnswerOptions(prev => prev.map((option, idx) => idx === i ? { ...option, class: optionsClasses.incorrect } : option));
                answerTemplateOptions.current = templateOptions.incorrect;
                setAnswerStatus("incorrect");
            }
            else if (i === correctAnswerPosition.current) {
                setAnswerOptions(prev => prev.map((option, idx) => idx === i ? { ...option, class: optionsClasses.correct } : option));

                if (i === id) {
                    answerTemplateOptions.current = templateOptions.correct;
                    setAnswerStatus("correct");
                }
            }
            else {
                // For giving up 
                if (id < 0) {
                    answerTemplateOptions.current = templateOptions.showAnswer;
                    setAnswerStatus("showAnswer");
                }

                answerOptions[i].class = optionsClasses.inactive;
            }
        }
    }, [answerOptions, answerStatus, currentCard]);

    const pronounceWord = useCallback(() => {
        const word = isFrontLanguageChanged ? currentCard.definition : currentCard.term;
        const language = isFrontLanguageChanged ? props.languages.definition : props.languages.term;
        if (word) {
            playSound(word, language.code);
        }
    }, [currentCard.definition, currentCard.term, isFrontLanguageChanged, props.languages]);

    useEffect(() => {
        currentIdRef.current = currentCard.id;
    }, [currentCard.id]);

    const toNextWord = useCallback(() => {
        if (showResultPage) return;
        const updatedTestCards = testCards.slice();

        if (answerStatus === "correct") {
            // remove the correct word from the collection 
            updatedTestCards.shift();
            if (updatedTestCards.length === 0) {
                setShowResultPage(true);
                setTestCards([]);
                setAnsweredCards([...answeredCards, currentCard]);

                return;
            }
            wordsRoundCounter.current++;
            setAnsweredCards([...answeredCards, currentCard]);
        } else {
            const incorrectAnswer = updatedTestCards.shift();
            if (incorrectAnswer) updatedTestCards.splice(wordsPerRound - answeredCards.length - 1, 0, incorrectAnswer);
        }

        // Show the result page
        if (wordsRoundCounter.current === wordsPerRound) {
            setShowResultPage(true);
            wordsRoundCounter.current = 0;
        }

        setAnswerStatus("");
        setTestCards(updatedTestCards);
        setCurrentCard(updatedTestCards[0]);
        answerTemplateOptions.current = templateOptions.default;

    }, [testCards, answerStatus, currentCard, answeredCards, wordsPerRound, showResultPage]);

    // if props.cards was changed then need to update studying-data
    useEffect(() => {
        setTestCards((prevTestCards) => {
            const updatedQueue = props.cards.filter(pCard =>
                prevTestCards.some(tCard => tCard.id === pCard.id) || pCard.id === currentIdRef.current
            );
            if (updatedQueue.length > 0) {
                setCurrentCard(updatedQueue[0]);
            }
            return updatedQueue;
        });
    }, [props.cards]);

    // TODO: rewrite this to function
    // Set answer options
    useEffect(() => {
        if (!testCards || !currentCard) return;
        const localOptions: CardWithClass[] = [];
        correctAnswerPosition.current = getRandomInt(0, answersNumber - 1);

        for (let i = 0; i < answersNumber; i++) {
            let newOption: BaseCard = { id: 0, term: "", definition: "", isFavorite: false };
            // Add correct answer card
            if (i === correctAnswerPosition.current) {
                newOption = currentCard;
            } else {
                // Trying to generate unique incorrect answer options
                let isGenerating = true;
                let incorrectAnswerId: number;
                loop: while (isGenerating) {

                    incorrectAnswerId = getRandomInt(0, props.cards.length - 1);

                    for (let v = 0; v < localOptions.length; v++) {
                        if (localOptions[v].id === props.cards[incorrectAnswerId].id) {
                            continue loop;
                        }
                    }

                    // Push only if it is an incorrect option
                    if (props.cards[incorrectAnswerId].id !== currentCard.id) {
                        newOption = props.cards[incorrectAnswerId];
                        isGenerating = false;
                    }
                }
            }
            localOptions.push({ ...newOption, class: optionsClasses.default });
        }

        setAnswerOptions(localOptions);

    }, [answersNumber, testCards, currentCard, props.cards]);

    // <Pronounce the term> setting 
    useEffect(() => {
        if (!showResultPage && props.settings.isPronounce) {
            pronounceWord();
        }
    }, [showResultPage, pronounceWord, props.settings.isPronounce]);

    // Keyboard
    useEffect(() => {
        const keyboard = (event: KeyboardEvent) => {
            if (answerStatus === "incorrect" || answerStatus === "showAnswer") {
                if (event.code && !deniedKeys.includes(event.key)) {
                    setTimeout(() => {
                        toNextWord();
                    }, 0);
                }
            }
            if (Number(event.key) > 0 && Number(event.key) <= 4) {
                checkAnswer((Number(event.key) - 1) as TestAnswerId);
            }
        }

        if (answerStatus === "correct") {
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

    return (
        <div>
            {testCards.length !== 0 && !showResultPage ?
                <div>
                    <div className={styles.container}>
                        <div className={styles.progress}>{wordsCounterLabel}</div>
                        <div className={styles.term} >
                            <span onClick={pronounceWord}>{isFrontLanguageChanged ? currentCard.definition : currentCard.term}</span>
                        </div>
                        <TestOptions
                            currentCard={currentCard}
                            answerOptions={answerOptions}
                            selectionHandler={checkAnswer}
                            testTitleOptions={answerTemplateOptions}
                            changeLanguage={isFrontLanguageChanged}
                            isNextBtn={answerStatus !== "" && answerStatus !== "correct"}
                            toNextWord={toNextWord}
                        />
                    </div>
                </div>
                : <ResultPage
                    cards={answeredCards}
                    changeCards={setAnsweredCards}
                    closeResultPage={() => { setShowResultPage(false); setAnsweredCards([]) }}
                    isGameOver={testCards.length === 0}
                    language={props.languages.term.code}
                    additionalText=""
                />
            }
        </div>
    );
}