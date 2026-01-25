"use client"

import { CardsPreview } from "@/components/UI/CardsPreview/CardsPreview";
import { Slider } from "@/components/UI/Slider/Slider";
import { DeleteDialog } from "@/components/dialogs/DeleteDialog";
import { ModuleOptions } from "./ModuleOptions/ModuleOptions";
import { LearningTypes } from "./LearningTypes";
import { AppModule, BaseCard } from "@/types/module";
import styles from "./Module.module.css";
import { useCallback, useRef, useState } from "react";
import { PencilIcon } from "@/icons/PencilIcon";
import { Button } from "@/components/UI/Button/Button";

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

    const callRefreshCards = useCallback(() => {
        if (sliderRef.current) {
            sliderRef.current.refreshCards();
        }
    }, []);

    const callSwitchDefaultSides = useCallback(() => {
        if (sliderRef.current) {
            sliderRef.current.switchDefaultSides();
        }
    }, []);

    return (
        <main>
            {cards && cards.length > 0 && <div>
                {isDeleteWin && (
                    <DeleteDialog
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
                        changeCards={setCards}
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
                        changeCards={setCards}
                        language={initialModule.termLanguage.code}
                        showEditButton={true}
                    />
                    {!initialModule.isLocal &&
                        <div className={styles.updateButton}>
                            <Button href={`/module/${initialModule.id}/edit`} background="primary" size="full" isBold>
                                <>
                                    <svg viewBox="0 0 24 24" width={24} height={24} strokeWidth={2} stroke="white" fill="transparent" xmlns="http://www.w3.org/2000/svg"><PencilIcon /></svg>&nbsp;
                                    <span>Add or remove words</span>
                                </>
                            </Button>
                        </div>
                    }
                </div>
            </div>}
        </main>
    );
}