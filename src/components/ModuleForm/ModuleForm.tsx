"use client"

import { useCallback, useEffect, useRef, useState } from 'react';
import { ValidationErrors } from '@/types/types';
import { Select } from '@/components/UI/SelectLanguage/Select';
import styles from "./ModuleForm.module.css";
import { useRouter } from 'next/navigation';
import { validateAndSanitize } from '@/utils/module/validateModule';
import { Language } from '@/generated/prisma/browser';
import { CreateCard } from './CreateCard/CreateCard';
import { AppModule, BaseCard, CreateModuleInput } from '@/types/module';
import { createModuleAction, updateModuleAction } from '@/services/moduleActions';
import { Spinner } from '../UI/Spinner/Spinner';

const emptyCard = { id: 0, term: "", definition: "", isFavorite: false };

interface ModuleFormProps {
    languagesList: Language[];
    initialModule?: AppModule;
}

// TODO: 1) Re-renders could be optimized!
export const ModuleForm = ({ languagesList, initialModule }: ModuleFormProps) => {
    const [cards, setCards] = useState<BaseCard[]>(initialModule ? initialModule.cards : [emptyCard]);
    const [termLanguage, setTermLanguage] = useState(initialModule?.termLanguage || languagesList[0]);
    const [definitionLanguage, setDefinitionLanguage] = useState(initialModule?.termLanguage || languagesList[0]);

    const [formErrors, setFormErrors] = useState<ValidationErrors>();
    const [createdCardIndex, setCreatedCardIndex] = useState<number | null>(null);
    const [saveLoading, setSaveLoading] = useState(false);
    const router = useRouter();

    // TODO: use createdCardId instead
    const newCardAdded = useRef(false);

    const nameInputRef = useRef<HTMLInputElement | null>(null);
    const descriptionInputRef = useRef<HTMLInputElement | null>(null);
    const bottomRef = useRef<HTMLButtonElement>(null);

    const addCard = useCallback((e?: React.MouseEvent<HTMLButtonElement>) => {
        if (e) e.preventDefault();
        setCards((prevCards) => {
            const lastId = prevCards.length > 0 ? prevCards[prevCards.length - 1].id : 0;
            const newCard = { ...emptyCard, id: lastId + 1 };

            setCreatedCardIndex(prevCards.length);

            return [...prevCards, newCard];
        });

        newCardAdded.current = true;
    }, []);

    const deleteCard = useCallback((id: number) => {
        setCards((prev) => {
            if (prev.length === 1) return prev;
            return prev.filter((_, index) => index !== id);
        });
    }, []);

    const saveCards = async () => {
        const name = nameInputRef.current?.value || "";
        const description = descriptionInputRef.current?.value || "";
        const { isValid, errors, sanitizedCards } = validateAndSanitize(name, description, cards);

        if (!isValid) {
            setFormErrors(errors);
            if (errors.name) nameInputRef.current?.focus();
            else if (errors.description) descriptionInputRef.current?.focus();
            else if (errors.cards) alert(errors.cards);

            return false;
        }
        if (nameInputRef.current && descriptionInputRef.current) {
            setSaveLoading(true);
            let redirectModuleId;
            const newModule: CreateModuleInput = {
                name,
                description,
                termLanguageId: termLanguage.id,
                definitionLanguageId: definitionLanguage.id,
                cards: sanitizedCards
            }

            if (initialModule) { // Update
                const updatedModule = await updateModuleAction(+initialModule.id, newModule);
                if (updatedModule.success && updatedModule.data) {
                    redirectModuleId = updatedModule.data.id;
                } else {
                    alert("Error updating module");
                }
            } else { // Create
                const createdModule = await createModuleAction(newModule);
                if (createdModule.success && createdModule.data) {
                    redirectModuleId = createdModule.data.id;
                } else {
                    alert("Error creating module");
                }
            }
            setSaveLoading(false);
            router.push(`/module/${redirectModuleId}`);
        }
    }

    // Scroll down
    useEffect(() => {
        if (newCardAdded.current) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
            newCardAdded.current = false;
        }
    }, [cards.length]);

    return (
        <main className="main">
            <div className={styles.moduleForm}>
                {!initialModule &&
                    <div className={styles.title}>Create a new module</div>
                }
                <div className={styles.info}>
                    <div className={styles.infoFields}>
                        <input
                            type="text" ref={nameInputRef}
                            className={!formErrors?.name ? styles.field : `${styles.field} ${styles.error}`}
                            defaultValue={initialModule ? initialModule.name : ""}
                            placeholder='Name'
                            autoFocus
                        />
                        <input
                            type='text'
                            ref={descriptionInputRef}
                            className={!formErrors?.description ? styles.field : `${styles.field} ${styles.error}`}
                            defaultValue={initialModule ? initialModule.description : ""}
                            placeholder='Description'
                        />
                    </div>
                    <div className={styles.buttonSave} onClick={saveCards}>{saveLoading ? <Spinner /> : "Save"}</div>
                </div>
                <div className={styles.languages}>
                    <div className={styles.language}>
                        <Select languages={languagesList}
                            label="Original Language"
                            selectedLanguage={termLanguage}
                            changeLanguage={setTermLanguage}
                        />
                    </div>
                    <div className={styles.language}>
                        <Select
                            languages={languagesList}
                            label="Translation Language"
                            selectedLanguage={definitionLanguage}
                            changeLanguage={setDefinitionLanguage}
                        />
                    </div>
                </div>
                <div className={styles.createContainer + " create__content"}>
                    {cards.map((el, id) => (
                        <CreateCard
                            key={el.id}
                            setCards={setCards}
                            deleteCard={deleteCard}
                            card={el}
                            cardId={id}
                            useFocus={createdCardIndex === id}
                            isLast={id === cards.length - 1}
                            onAddCard={addCard}
                        />
                    ))}
                </div>
                <button className={styles.addCard} ref={bottomRef} onMouseDown={addCard}>
                    Add Card
                </button>
            </div>
        </main >
    )
}