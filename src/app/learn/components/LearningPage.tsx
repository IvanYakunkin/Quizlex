"use client"

import { useEffect, useState } from "react";
import { LearningHeader } from "./LearningHeader";
import { Test } from "./Test/Test";
import { Writing } from "./Writing/Writing";
import { LearningType } from "@/types/types";
import styles from "../page.module.css"
import { Cards } from "./Cards/Cards";
import { AppModule, BaseCard } from "@/types/module";
import { notFound } from "next/navigation";

interface LearningProps {
    learningType: LearningType;
    module?: AppModule | null;
}

const defaultLanguages = { term: "en-EN", definition: "en-EN" };

export const LearningPage = ({ learningType, module }: LearningProps) => {
    const [cards, setCards] = useState<BaseCard[] | null>(module ? module.cards : null);
    const [changeLanguage, setChangeLanguage] = useState(false);
    const [languages, setLanguages] = useState(module ? { term: module.termLanguage.code, definition: module.definitionLanguage.code } : defaultLanguages);

    useEffect(() => {
        if (!cards) {
            const cardsRawModule = localStorage.getItem("module");
            if (cardsRawModule) {
                const parsedModule: AppModule = JSON.parse(cardsRawModule);
                setCards(parsedModule.cards);
                setLanguages({ term: parsedModule.termLanguage.code, definition: parsedModule.definitionLanguage.code });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderLearningComponent = () => {
        if (cards) {
            switch (learningType) {
                case "test":
                    return <Test cards={cards} languages={languages} changeLanguage={changeLanguage} />
                case "writing":
                    return <Writing cards={cards} languages={languages} changeLanguage={changeLanguage} />
                case "cards":
                    return <Cards cards={cards} languages={languages} changeLanguage={changeLanguage} />
                default:
                    return notFound();
            }
        }
    }

    return (
        <main className="main">
            <div className={styles.learning}>
                <LearningHeader changeLanguage={changeLanguage} setChangeLanguage={setChangeLanguage} moduleId={module ? module.id : undefined} />
                {renderLearningComponent()}
            </div>
        </main>
    );
}