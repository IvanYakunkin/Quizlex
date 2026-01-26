"use client"

import { useCallback, useEffect, useState } from "react";
import { LearningHeader } from "./LearningHeader";
import { Test } from "./Test/Test";
import { Writing } from "./Writing/Writing";
import { LearningType, StudySettings } from "@/types/types";
import styles from "../page.module.css"
import { Cards } from "./Cards/Cards";
import { AppModule, BaseCard } from "@/types/module";
import { Match } from "./Match/Match";
import { shuffleCards } from "@/utils/cards/shuffleCards";
import { SettingsDialog } from "@/components/dialogs/Settings/SettingsDialog";

interface LearningProps {
    learningType: LearningType;
    module?: AppModule | null;
}

const defaultLanguages = {
    term: {
        id: 1,
        name: "English",
        code: "EN-US"
    },
    definition: {
        id: 1,
        name: "English",
        code: "EN-US"
    }
}

export const LearningPage = ({ learningType, module }: LearningProps) => {
    const getDefaultSettings = useCallback((): StudySettings => {
        const base = {
            frontLanguage: module?.termLanguage || defaultLanguages.term,
            isPronounce: false,
            isStudyFavorites: false
        };

        if (learningType === "cards") {
            return { ...base, trackProgress: true };
        }
        return { ...base, wordsPerRound: 5 };
    }, [learningType, module]);

    const [cards, setCards] = useState<BaseCard[]>(module ? module.cards : []);
    const [languages, setLanguages] = useState(module ? { term: module.termLanguage, definition: module.definitionLanguage } : defaultLanguages);
    const [localModuleName, setLocalModuleName] = useState<string | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [settings, setSettings] = useState<StudySettings>(getDefaultSettings);
    // To reset studying progress
    const [currentSession, setCurrentSession] = useState(0);

    const getCardsForMatch = () => {
        if (!cards) return null;

        return shuffleCards(cards).splice(0, 6);
    }

    const resetStudying = () => {
        setCurrentSession(currentSession + 1);
        setSettings(getDefaultSettings);
        if (module) {
            setCards(module.cards);
        }
    }

    const changeSettings = (newSettings: StudySettings) => {
        if (newSettings.isStudyFavorites !== settings.isStudyFavorites && module) {
            resetStudying();
            if (newSettings.isStudyFavorites) {
                if (newSettings.isStudyFavorites) {
                    const favorites = module.cards.filter(c => c.isFavorite);
                    if (favorites.length === 0) {
                        newSettings.isStudyFavorites = false;
                    } else {
                        setCards(favorites);
                    }
                }
            } else {
                setCards(module.cards);
            }
        }

        setSettings(newSettings);
    }

    useEffect(() => {
        if (!cards) {
            const cardsRawModule = localStorage.getItem("module");
            if (cardsRawModule) {
                const parsedModule: AppModule = JSON.parse(cardsRawModule);
                setCards(parsedModule.cards);
                setLanguages({ term: parsedModule.termLanguage, definition: parsedModule.definitionLanguage });
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
                    openSettings={() => setIsSettingsOpen(true)}
                    moduleId={module ? module.id : undefined}
                    moduleName={module ? module.name : undefined}
                />
                {learningType === "test" && <Test key={currentSession} cards={cards} languages={languages} settings={settings} />}
                {learningType === "writing" && <Writing key={currentSession} cards={cards} languages={languages} settings={settings} />}
                {learningType === "cards" && <Cards key={currentSession} cards={cards} languages={languages} settings={settings} setCards={setCards} />}
            </div>

            <SettingsDialog
                key={currentSession}
                settings={settings}
                isOpen={isSettingsOpen}
                moduleLanguages={languages}
                onClose={() => setIsSettingsOpen(false)}
                onSave={changeSettings}
                onReset={resetStudying}
                onShuffle={() => setCards(shuffleCards(cards))}
            />
        </main>
    );
}