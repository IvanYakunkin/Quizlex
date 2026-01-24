import { useEffect, useState } from "react";
import styles from "./MatchGame.module.css";
import { MatchCard } from "@/types/types";

interface MatchGameProps {
    matchCards: MatchCard[];
    addPenalty: () => void;
    showResultsPage: () => void;
}

export const MatchGame = ({ matchCards, addPenalty, showResultsPage }: MatchGameProps) => {
    const [activeCard, setActiveCard] = useState<MatchCard | null>(null);
    const [hiddenIds, setHiddenIds] = useState<number[]>([]);
    const [mistakenCards, setMistakenCards] = useState<MatchCard[]>([]);

    const handleCardClick = (card: MatchCard) => {
        if (!activeCard) {
            setActiveCard(card);
            return;
        }

        if (card !== activeCard) {
            if (card.cardId === activeCard?.cardId) {
                setHiddenIds(prev => [...prev, card.cardId]);

            } else {
                setMistakenCards([card, activeCard]);
                addPenalty();
            }
        }

        setActiveCard(null);
    }

    const generateClassName = (card: MatchCard) => {
        let className = styles.card;
        if (hiddenIds.includes(card.cardId)) {
            className += " " + styles.hidden;
        } else if (activeCard === card) {
            className += " " + styles.active;
        } else if (mistakenCards.length > 0 && mistakenCards.includes(card)) {
            className += " " + styles.mistake;
        }
        return className;
    }

    useEffect(() => {
        if (mistakenCards.length > 0) {
            const timer = setTimeout(() => {
                setMistakenCards([]);
            }, 200);

            return () => clearTimeout(timer);
        }
    }, [mistakenCards]);

    useEffect(() => {
        if (hiddenIds.length * 2 === matchCards.length) {
            showResultsPage();
        }
    }, [hiddenIds, showResultsPage, matchCards.length]);

    return (
        <div className={styles.cards}>
            {matchCards.map((card, index) => (
                <div
                    className={generateClassName(card)}
                    key={index}
                    onClick={() => handleCardClick(card)}
                >
                    <div className={styles.displayValue}>{card.displayValue}</div>
                </div>
            ))}
        </div>
    )
}