import { Languages, StudySettings } from "@/types/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { Slider } from "@/components/UI/Slider/Slider";
import { ResultPage } from "../ResultPage";
import { BaseCard } from "@/types/module";
import styles from "../../page.module.css";
import { ShuffleButton } from "@/components/features/ShuffleButton";
import { BackButton } from "@/components/features/BackButton";
import { playSound } from "@/utils/audio/playSound";

interface SliderRef {
    toPrevious: () => void;
    toNext: () => void;
    switchDefaultSides: () => void;
}

interface CardsProps {
    cards: BaseCard[];
    settings: StudySettings;
    languages: Languages;
    shuffleCards: () => void;
}

interface AnsweredCard extends BaseCard {
    isCorrect: boolean;
}

export const Cards = (props: CardsProps) => {
    const [cards, setCards] = useState(props.cards);
    const [currentCardId, setCurrentCardId] = useState(0);
    const [answeredCards, setAnsweredCards] = useState<AnsweredCard[]>([]);
    // Number of correct/incorrect answered cards
    const [correctNumber, setCorrectNumber] = useState(0);
    const [incorrectNumber, setIncorrectNumber] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const currentLanguage = useRef(props.settings.frontLanguage);

    const sliderRef = useRef<SliderRef>(null);

    const isFrontLanguageChanged = props.settings.frontLanguage.id !== props.languages.term.id;

    const backBtnClick = () => {
        if (sliderRef.current && currentCardId !== 0) {
            if (answeredCards[answeredCards.length - 1].isCorrect) {
                setCorrectNumber(correctNumber - 1);
            } else {
                setIncorrectNumber(incorrectNumber - 1)
            }

            setAnsweredCards(answeredCards.slice(0, -1));
            sliderRef.current.toPrevious();
        }
    }

    const goNextCorrect = useCallback(() => {
        if (sliderRef.current) {
            if (currentCardId === cards.length - 1) {
                setIsFinished(true);
            }
            setAnsweredCards([...answeredCards, { ...cards[currentCardId], isCorrect: true }]);
            setCorrectNumber(correctNumber + 1);
            sliderRef.current.toNext();
        }
    }, [currentCardId, answeredCards, cards, correctNumber]);

    const goNextIncorrect = useCallback(() => {
        if (sliderRef.current) {
            if (currentCardId === cards.length - 1) {
                setIsFinished(true);
            }
            setAnsweredCards([...answeredCards, { ...cards[currentCardId], isCorrect: false }]);
            setIncorrectNumber(incorrectNumber + 1);
            sliderRef.current.toNext();
        }
    }, [answeredCards, cards, currentCardId, incorrectNumber]);

    const pronounceWord = useCallback(() => {
        const word = isFrontLanguageChanged ? cards[currentCardId].definition : cards[currentCardId].term;
        const language = isFrontLanguageChanged ? props.languages.definition : props.languages.term;
        if (word) {
            playSound(word, language.code);
        }
    }, [cards, currentCardId, props.languages, isFrontLanguageChanged]);

    // Go to the next round
    const refreshCards = () => {
        setIsFinished(false);
        setCards(answeredCards.filter(card => !card.isCorrect));
        setAnsweredCards([]);
        setCorrectNumber(0);
        setIncorrectNumber(0);
        setCurrentCardId(0)
    }

    useEffect(() => {
        const keyboard = (event: KeyboardEvent) => {
            if (event.code === "ArrowRight" || event.code === "Digit2") {
                goNextCorrect();
            } else if (event.code === "ArrowLeft" || event.code === "Digit1") {
                goNextIncorrect();
            }
        }

        window.addEventListener("keydown", keyboard);

        return () => {
            window.removeEventListener("keydown", keyboard);
        }
    }, [goNextCorrect, goNextIncorrect]);

    // TODO: when change favorites and front lang - language is the same!
    useEffect(() => {
        if (currentLanguage.current.id !== props.settings.frontLanguage.id) {
            sliderRef.current?.switchDefaultSides();
            currentLanguage.current = props.settings.frontLanguage;
        }
    }, [props.settings]);

    if (props.cards !== cards) {
        setCards(props.cards);
        setAnsweredCards([]);
        setCurrentCardId(0);
        setCorrectNumber(0);
        setIncorrectNumber(0);
    }

    // <Pronounce the term> setting 
    useEffect(() => {
        if (props.settings.isPronounce) {
            pronounceWord();
        }
    }, [pronounceWord, props.settings.isPronounce]);

    return (
        <div>
            {isFinished ?
                <ResultPage
                    cards={answeredCards.filter(card => !card.isCorrect)}
                    changeCards={setAnsweredCards}
                    closeResultPage={refreshCards}
                    isGameOver={incorrectNumber === 0}
                    language="german"
                    additionalText=""
                    title={incorrectNumber > 0 ? "Words you should learn:" : "Congratulations! You have learned all the words!"}
                />
                :
                <div className={styles.cardsContainer}>
                    <div className={styles.cardsProgress}>
                        <div className={`${styles.progressOption} ${styles.incorrect}`}>
                            <div className={`${styles.progressCounter} ${styles.incorrect}`}>{incorrectNumber}</div>
                            <span>Still studying</span>
                        </div>
                        <div className={`${styles.progressOption} ${styles.correct}`}>
                            <span>Studied</span>
                            <div className={`${styles.progressCounter} ${styles.correct}`}>{correctNumber}</div>
                        </div>
                    </div>

                    <Slider
                        cards={cards}
                        sliderRef={sliderRef}
                        changeCards={(newCards: BaseCard[]) => setCards(newCards)}
                        languages={props.languages}
                        currentCardId={currentCardId}
                        setCurrentCardId={setCurrentCardId}
                        isNavigationHidden={true}
                        isMaxHeight={true}
                    />

                    <div className={styles.options}>
                        <div className={styles.optionsLeft}>
                            <BackButton onClick={backBtnClick} />
                        </div>

                        <div className={styles.optionsCenter}>
                            <div className={styles.optionsAnswer} onClick={goNextIncorrect} title="Need to study up">
                                <svg viewBox="0 0 22 22">
                                    <line x1="4" y1="17" x2="17" y2="4" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" />
                                    <line x1="4" y1="4" x2="17" y2="17" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div className={styles.optionsAnswer} onClick={goNextCorrect} title="I know">
                                <svg viewBox="0 0 24 30">
                                    <path d="M2 15l7 7L22 7" stroke="#28a745" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>

                        <div className={styles.optionsRight}>
                            <ShuffleButton onClick={props.shuffleCards} />
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}