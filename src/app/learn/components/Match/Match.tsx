import { BaseCard } from "@/types/module";
import styles from "./Match.module.css";
import { MatchHeader } from "./MatchHeader/MatchHeader";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { MatchPreview } from "./MatchPreview/MatchPreview";
import { useCallback, useEffect, useRef, useState } from "react";
import { MatchGame } from "./MatchGame/MatchGame";
import { MatchCard } from "@/types/types";
import { shuffleCards } from "@/utils/cards/shuffleCards";
import { MatchResult } from "./MatchResult/MatchResult";

interface MatchProps {
    loadCards: () => BaseCard[] | null;
    moduleName: string;
    moduleId?: number | string;
}

export const Match = ({ loadCards, moduleName, moduleId }: MatchProps) => {
    const router = useRouter();
    const { status } = useSession();
    const [matchCards, setMatchCards] = useState<MatchCard[] | null>(null);
    const [currentPage, setCurrentPage] = useState<"preview" | "game" | "results">("preview");
    const [seconds, setSeconds] = useState(0);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const timerDisplayRef = useRef<HTMLDivElement>(null);
    const secondsRef = useRef(0);

    const startTimer = () => {
        secondsRef.current = 0;
        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            secondsRef.current = +(secondsRef.current + 0.1).toFixed(1);
            if (timerDisplayRef.current) {
                timerDisplayRef.current.innerText = `${secondsRef.current.toFixed(1)}s`;
            }
        }, 100);
    };

    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const handleExitBtn = useCallback(() => {
        if (status === "authenticated" && moduleId) {
            router.push(`/module/${moduleId}`);
        } else {
            router.push("/module");
        }
    }, [moduleId, router, status]);

    const startGame = () => {
        const loadedCards = loadCards();
        if (!loadedCards) return null;

        const localCards = [...loadedCards];
        const localMatchCards: MatchCard[] = [];
        for (let i = 0; i < localCards.length; i++) {
            localMatchCards.push({ displayValue: localCards[i].term, cardId: localCards[i].id });
            localMatchCards.push({ displayValue: localCards[i].definition, cardId: localCards[i].id });
        }
        setMatchCards(shuffleCards(localMatchCards));
        setCurrentPage("game");
        startTimer();
    }

    const showResultsPage = useCallback(() => {
        stopTimer();
        setSeconds(secondsRef.current);
        setCurrentPage("results");
    }, []);

    const addPenalty = useCallback(() => {
        secondsRef.current += 1;
    }, []);

    useEffect(() => {
        return () => stopTimer();
    }, []);

    return (
        <div className={styles.match}>
            <MatchHeader timerRef={timerDisplayRef} middleValue={currentPage === 'preview' ? moduleName : '0.0s'} onClose={handleExitBtn} />
            {currentPage === "preview" &&
                <MatchPreview onStart={startGame} />}
            {currentPage === "game" && matchCards &&
                <MatchGame matchCards={matchCards} addPenalty={addPenalty} showResultsPage={showResultsPage} />}
            {currentPage === "results" &&
                <MatchResult seconds={seconds} playAgain={startGame} />}
            <div></div>
        </div>
    );
}