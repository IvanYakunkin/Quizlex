import { useState, useRef, useCallback, useSyncExternalStore, useMemo, useEffect } from "react";
import { Languages, StudySettings, WritingStatus } from "@/types/types";
import { checkWriting } from "@/utils/cards/checkWriting";
import { BaseCard } from "@/types/module";
import { playSound } from "@/utils/audio/playSound";

interface UseWritingLogicProps {
    cards: BaseCard[];
    settings: StudySettings;
    languages: Languages;
    successTimerDuration?: number;
}

const subscribe = () => () => { };
const getServerSnapshot = () => false;
const getClientSnapshot = () => true;

export const useWritingLogic = ({
    cards,
    settings,
    languages,
    successTimerDuration = 600
}: UseWritingLogicProps) => {
    const isMounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

    const [testCards, setTestCards] = useState<BaseCard[]>(cards);
    const [answeredCards, setAnsweredCards] = useState<BaseCard[]>([]);
    const [writingStatus, setWritingStatus] = useState<WritingStatus>("");
    const [inputValue, setInputValue] = useState("");

    const wordsPerRound = useMemo(() => {
        if (settings.wordsPerRound && settings.wordsPerRound < cards.length) {
            return settings.wordsPerRound;
        }
        return 10;
    }, [settings.wordsPerRound, cards.length]);

    const wordsRoundCounter = useRef(0);
    const currentIdRef = useRef(testCards[0]);

    const isFrontLanguageChanged = settings.frontLanguage.id !== languages.term.id;

    const pronounceWord = useCallback(() => {
        const word = isFrontLanguageChanged ? testCards[0].definition : testCards[0].term;
        const language = isFrontLanguageChanged ? languages.definition : languages.term;
        if (word) {
            playSound(word, language.code);
        }
    }, [isFrontLanguageChanged, languages, testCards]);

    const toNextWord = useCallback((isCorrect?: boolean) => {
        if (!testCards[0]) return;
        setInputValue("");
        setWritingStatus("");

        if (!isCorrect) {
            setTestCards(prev => {
                const copyCards = prev.slice();
                const incorrectAnswer = copyCards.shift();
                if (incorrectAnswer) {
                    copyCards.splice(wordsPerRound - answeredCards.length - 1, 0, incorrectAnswer)
                }

                return copyCards;
            });
        } else {
            setAnsweredCards(prev => [...prev, testCards[0]]);

            setTestCards(prev => prev.slice(1));

            wordsRoundCounter.current += 1;

            if (wordsRoundCounter.current >= wordsPerRound) {
                setWritingStatus("result");
                wordsRoundCounter.current = 0;
            }
        }
    }, [wordsPerRound, testCards, answeredCards.length]);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const checkAnswer = useCallback(() => {
        if (writingStatus === "correct" || writingStatus === "mistake") return;
        const correctAnswer = isFrontLanguageChanged ? testCards[0].term : testCards[0].definition;
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
    }, [inputValue, testCards, isFrontLanguageChanged, toNextWord, successTimerDuration, writingStatus]);

    const resetRound = useCallback(() => {
        setWritingStatus("");
        setAnsweredCards([]);
    }, []);

    // if props.cards was changed then need to update studying-data
    useEffect(() => {
        setTestCards((prevTestCards) => {
            const updatedQueue = cards.filter(pCard =>
                prevTestCards.some(tCard => tCard.id === pCard.id) || pCard.id === currentIdRef.current.id
            );
            if (updatedQueue.length > 0) {
                //settestCards[0](updatedQueue[0]);
            }
            return updatedQueue;
        });
    }, [cards]);

    useEffect(() => {
        currentIdRef.current = testCards[0];
    }, [testCards]);

    // <Pronounce the term> setting 
    useEffect(() => {
        if (writingStatus === "" && settings.isPronounce) {
            pronounceWord();
        }
    }, [pronounceWord, settings.isPronounce, writingStatus]);

    return {
        state: {
            testCards,
            answeredCards,
            writingStatus,
            currentCard: testCards[0],
            inputValue,
            isMounted,
            progressLabel: `${cards.length - testCards.length + 1} / ${cards.length}`
        },
        actions: {
            setInputValue,
            checkAnswer,
            toNextWord,
            resetRound,
            setAnsweredCards,
            pronounceWord
        }
    };
};