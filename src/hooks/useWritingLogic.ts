import { useState, useRef, useCallback, useSyncExternalStore } from "react";
import { Card, WritingStatus } from "@/types/types";
import { getRandomInt } from "@/utils/cards/shuffleCards";
import { checkWriting } from "@/utils/cards/checkWriting";

interface UseWritingLogicProps {
    cards: Card[];
    changeLanguage: boolean;
    maxWordsPerRound?: number;
    successTimerDuration?: number;
}

const subscribe = () => () => { };
const getServerSnapshot = () => false;
const getClientSnapshot = () => true;

export const useWritingLogic = ({
    cards,
    changeLanguage,
    maxWordsPerRound = 10,
    successTimerDuration = 600
}: UseWritingLogicProps) => {
    const isMounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

    const [testCards, setTestCards] = useState<Card[]>(() => cards);
    const [answeredCards, setAnsweredCards] = useState<Card[]>([]);
    const [writingStatus, setWritingStatus] = useState<WritingStatus>("");
    const [inputValue, setInputValue] = useState("");

    const [currentCard, setCurrentCard] = useState<Card>(() => {
        return cards[getRandomInt(0, cards.length - 1)];
    });

    const wordsRoundCounter = useRef(0);

    const toNextWord = useCallback((isCorrect?: boolean) => {
        if (!currentCard) return;

        setInputValue("");
        setWritingStatus("");

        if (!isCorrect) {
            setTestCards((prev) => {
                const nextIndex = getRandomInt(0, prev.length - 1);
                setCurrentCard(prev[nextIndex]);
                return prev;
            });
            return;
        }

        setAnsweredCards(prev => {
            if (prev.some(c => c.id === currentCard.id)) return prev;
            return [...prev, currentCard];
        });

        wordsRoundCounter.current += 1;

        setTestCards((prev) => {
            const nextCards = prev.filter(card => card.id !== currentCard.id);

            if (nextCards.length === 0) {
                setWritingStatus("finished");
                return [];
            }

            if (wordsRoundCounter.current >= maxWordsPerRound) {
                setWritingStatus("result");
                wordsRoundCounter.current = 0;
            } else {
                const nextIndex = getRandomInt(0, nextCards.length - 1);
                setCurrentCard(nextCards[nextIndex]);
            }

            return nextCards;
        });
    }, [currentCard, maxWordsPerRound]);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const checkAnswer = useCallback(() => {
        if (writingStatus === "correct" || writingStatus === "mistake") return;
        const correctAnswer = changeLanguage ? currentCard.term : currentCard.definition;
        const isAnswerCorrect = checkWriting(inputValue, correctAnswer || "");

        if (isAnswerCorrect) {
            setWritingStatus("correct");

            if (timerRef.current) clearTimeout(timerRef.current);

            timerRef.current = setTimeout(() => {
                toNextWord(true);
                timerRef.current = null;
            }, successTimerDuration);
        } else if (inputValue.trim() === "") {
            setWritingStatus("empty");
        } else {
            setWritingStatus("mistake");
        }
    }, [inputValue, currentCard, changeLanguage, toNextWord, successTimerDuration, writingStatus]);

    const resetRound = useCallback(() => {
        setWritingStatus("");
        setAnsweredCards([]);
    }, []);

    return {
        state: {
            testCards,
            answeredCards,
            writingStatus,
            currentCard,
            inputValue,
            isMounted,
            progressLabel: `${cards.length - testCards.length + 1} / ${cards.length}`
        },
        actions: {
            setInputValue,
            checkAnswer,
            toNextWord,
            resetRound
        }
    };
};