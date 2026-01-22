"use client"

import { CardsPreview } from "@/components/UI/CardsPreview/CardsPreview";
import { Slider } from "@/components/UI/Slider/Slider";
import { DeleteWin } from "@/components/popups/DeleteWin";
import { ModuleOptions } from "./ModuleOptions/ModuleOptions";
import { LearningTypes } from "./LearningTypes";
import { AppModule, BaseCard } from "@/types/module";
import styles from "./Module.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

interface SliderRef {
    refreshCards: () => void;
    switchDefaultSides: () => void;
}

interface ModuleProps {
    initialModule: AppModule;
}

export const Module = ({ initialModule }: ModuleProps) => {
    const [cards, setCards] = useState<BaseCard[]>((initialModule && initialModule.cards) ? initialModule.cards : []);
    const [currentCardId, setCurrentCardId] = useState(0);
    const [isDeleteWin, setIsDeleteWin] = useState(false);
    const sliderRef = useRef<SliderRef>(null);

    const callRefreshCards = () => {
        if (sliderRef.current) {
            sliderRef.current.refreshCards();
        }
    }

    const callSwitchDefaultSides = () => {
        if (sliderRef.current) {
            sliderRef.current.switchDefaultSides();
        }
    }

    return (
        <main>
            {cards && cards.length > 0 && <div>
                {isDeleteWin && (
                    <DeleteWin
                        isOpen={isDeleteWin}
                        moduleId={initialModule.id}
                        moduleName={initialModule.name}
                        onClose={() => setIsDeleteWin(false)}
                    />
                )}

                <div className={styles.module}>

                    <div className={styles.title}>{initialModule.name}</div>
                    <div className={styles.subtitle}>{initialModule.description}</div>

                    <LearningTypes />

                    <Slider
                        cards={cards}
                        changeCards={(newCards: BaseCard[]) => setCards(newCards)}
                        sliderRef={sliderRef}
                        languages={{ term: initialModule.termLanguage.code, definition: initialModule.definitionLanguage.code }}
                        currentCardId={currentCardId}
                        setCurrentCardId={setCurrentCardId}
                    />

                    <ModuleOptions
                        moduleId={initialModule.id}
                        moduleName={initialModule.name}
                        onRefreshClick={callRefreshCards}
                        onSwitchSidesClick={callSwitchDefaultSides}
                    />

                    <div className={styles.wordsCounter}>
                        <div className={styles.wordsCounterLine}><span>{cards.length} Words</span></div>
                    </div>

                    <CardsPreview
                        title=""
                        showNumbers={false}
                        moduleId={!initialModule.isLocal ? +initialModule.id : undefined}
                        showOptions={true}
                        cards={cards}
                        changeCards={(newCards: BaseCard[]) => setCards(newCards)}
                        language={initialModule.termLanguage.code}
                    />
                    {!initialModule.isLocal &&
                        <Link href={`/module/${initialModule.id}/edit`} className={styles.updateButton}>
                            <Image src="/images/pen-white.png" width={20} height={20} alt="Pen" />
                            <span>Add or remove words</span>
                        </Link>
                    }
                </div>
            </div>}
        </main>
    );
}