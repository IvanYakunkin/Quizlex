"use client"

import { useEffect, useState } from "react";
import LearningHeader from "./LearningHeader";
import Test from "./Test/Test";
import { LearningType, ModuleInterface } from "@/types/types";
import styles from "../page.module.css"
import { Card, Language, Module } from "@/generated/prisma";
import Writing from "./Writing/Writing";
import Cards from "./Cards/Cards";

interface IModuleWithCards extends Module{
    cards: Card[];
    termLanguage: Language;
    definitionLanguage: Language;
}

interface LearningProps{
    learningType: LearningType;
    module?: IModuleWithCards;
}

const defaultLanguages = {term: "en-EN", definition: "en-EN"};

const LearningPage = ({ learningType, module }: LearningProps) => {
    const [cardsModule, setCardsModule] = useState<IModuleWithCards | ModuleInterface | null>(module ? module : null);
    const [changeLanguage, setChangeLanguage] = useState(false);
    const [languages, setLanguages] = useState(module ? {term: module.termLanguage.code, definition: module.definitionLanguage.code} : defaultLanguages);

    useEffect(() => {
        if(!cardsModule){
            const cardsRawModule = localStorage.getItem("module");
            if(cardsRawModule){
                setCardsModule(JSON.parse(cardsRawModule));
                setLanguages(JSON.parse(cardsRawModule).languages);
            }
        }
    }, [cardsModule]);

    const renderLearningComponent = () => {
        if(cardsModule){
            switch (learningType) {
                case "test":
                    return <Test cards={cardsModule.cards} languages={languages} changeLanguage={changeLanguage} />
                case "writing":
                    return <Writing cards={cardsModule.cards} languages={languages} changeLanguage={changeLanguage} />
                case "cards":
                    return <Cards cards={cardsModule.cards} languages={languages} changeLanguage={changeLanguage} />
                default:
                    return null;
            }
        }
    }

    return (
        <main className="main">
            <div className={styles.learning}>
                <LearningHeader changeLanguage={changeLanguage} setChangeLanguage={setChangeLanguage} moduleId={module ? module.id : undefined}/>
                { renderLearningComponent() }
            </div>    
        </main>
    );
}

export default LearningPage;