"use client"

import { useEffect, useState } from "react";
import { LearningHeader } from "./LearningHeader";
import { Test } from "./Test/Test";
import { Writing } from "./Writing/Writing";
import { LearningType } from "@/types/types";
import styles from "../page.module.css"
import { Cards } from "./Cards/Cards";
import { AppModule, BaseCard } from "@/types/module";
import { Match } from "./Match/Match";
import { shuffleCards } from "@/utils/cards/shuffleCards";

interface LearningProps {
    learningType: LearningType;
    module?: AppModule | null;
}

const defaultLanguages = { term: "en-EN", definition: "en-EN" };

export const LearningPage = ({ learningType, module }: LearningProps) => {
    const [cards, setCards] = useState<BaseCard[] | null>(module ? module.cards : null);
    const [changeLanguage, setChangeLanguage] = useState(false);
    const [languages, setLanguages] = useState(module ? { term: module.termLanguage.code, definition: module.definitionLanguage.code } : defaultLanguages);
    const [localModuleName, setLocalModuleName] = useState<string | null>(null);

    const getCardsForMatch = () => {
        if (!cards) return null;

        return shuffleCards(cards).splice(0, 6);
    }

    useEffect(() => {
        if (!cards) {
            const cardsRawModule = localStorage.getItem("module");
            if (cardsRawModule) {
                const parsedModule: AppModule = JSON.parse(cardsRawModule);
                setCards(parsedModule.cards);
                setLanguages({ term: parsedModule.termLanguage.code, definition: parsedModule.definitionLanguage.code });
                setLocalModuleName(parsedModule.name);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    if (!cards) return;

    if (learningType === "match" && (module || localModuleName)) {
        return <Match loadCards={getCardsForMatch} moduleId={module?.id} moduleName={module?.name ?? localModuleName as string} />;
    }

    return (
        <main className="main">
            <div className={styles.learning}>
                <LearningHeader
                    changeLanguage={changeLanguage}
                    setChangeLanguage={setChangeLanguage}
                    moduleId={module ? module.id : undefined}
                    moduleName={module ? module.name : undefined}
                />
                {learningType === "test" && <Test cards={cards} languages={languages} changeLanguage={changeLanguage} />}
                {learningType === "writing" && <Writing cards={cards} languages={languages} changeLanguage={changeLanguage} />}
                {learningType === "cards" && <Cards cards={cards} languages={languages} changeLanguage={changeLanguage} />}
            </div>
        </main>
    );
}