"use client"

import { CardsPreview } from "@/components/UI/CardsPreview/CardsPreview";
import { Slider } from "@/components/UI/Slider/Slider";
import { useEffect, useRef, useState } from "react";
import { DeleteWin } from "@/components/popups/DeleteWin";
import { EditWin } from "@/components/popups/EditWin";
import { ModuleOptions } from "./ModuleOptions/ModuleOptions";
import { LearningTypes } from "./LearningTypes";
import { AppModule, BaseCard } from "@/types/module";
import { updateCardAction } from "@/services/cardActions";
import styles from "./Module.module.css";
import Image from "next/image";
import Link from "next/link";

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
    const [isEditWin, setIsEditWin] = useState(false);
    const sliderRef = useRef<SliderRef>(null);

    useEffect(() => {
        if (isDeleteWin || isEditWin) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isDeleteWin, isEditWin]);

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

    const editCards = async (newCard: BaseCard) => {
        const updatedCards = cards.map(card => card.id === newCard.id ? newCard : card);
        setCards(updatedCards);
        if (!initialModule.isLocal) {
            await updateCardAction(+initialModule.id, newCard);
        } else {
            // Update Local Storage
            const storedData = localStorage.getItem('module');
            if (storedData) {
                const cardsModule = JSON.parse(storedData);
                cardsModule.cards = updatedCards;
                localStorage.setItem('module', JSON.stringify(cardsModule));
            }
        }
    }

    return (
        <main>
            {cards && cards.length > 0 && <div>
                {isDeleteWin && (
                    <DeleteWin
                        moduleId={initialModule.id}
                        moduleName={initialModule.name}
                        onClose={() => setIsDeleteWin(false)}
                    />
                )}

                {isEditWin && (
                    <EditWin
                        moduleId={initialModule.id}
                        onClose={() => setIsEditWin(false)}
                        card={cards[currentCardId]}
                        save={editCards}
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
                        onDeleteClick={() => setIsDeleteWin(true)}
                        onEditClick={() => setIsEditWin(true)}
                        onRefreshClick={callRefreshCards}
                        onSwitchSidesClick={callSwitchDefaultSides}
                    />

                    <div className={styles.wordsCounter}>
                        <div className={styles.wordsCounterLine}><span>{cards.length} Words</span></div>
                    </div>

                    <CardsPreview
                        title=""
                        showNumbers={false}
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