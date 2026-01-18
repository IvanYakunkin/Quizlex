"use client"

import { useCallback, useEffect, useRef, useState } from 'react';
import { Card, Languages, ModuleWithCards, ValidationErrors } from '@/types/types';
import Select from '@/components/UI/SelectLanguage/Select';
import styles from "./ModuleForm.module.css";
import { useRouter } from 'next/navigation';
import { createModuleDB } from '@/utils/createModule';
import { validateAndSanitize } from '@/utils/validateModule';
import { Language } from '@/generated/prisma/browser';
import { CreateCard } from './CreateCard/CreateCard';
import { updateModuleDB } from '@/utils/updateModule';

const emptyCard = { id: 0, term: "", definition: "", isFavorite: false };

interface ModuleFormProps {
    languagesList: Language[];
    initialModule?: ModuleWithCards;
}

const defaultLanguages = { term: "en-EN", definition: "en-EN" };

// TODO: 1) Re-renders could be optimized!
export const ModuleForm = ({ languagesList, initialModule }: ModuleFormProps) => {
    const [cards, setCards] = useState<Card[]>(initialModule ? initialModule.cards : [emptyCard]);

    const [selectedLanguages, setSelectedLanguages] = useState<Languages>(() => {
        const termLang = languagesList.find(l => l.id === initialModule?.termLanguageId);
        const defLang = languagesList.find(l => l.id === initialModule?.definitionLanguageId);
        return termLang && defLang ? { term: termLang.code, definition: defLang.code } : defaultLanguages;
    });

    const [formErrors, setFormErrors] = useState<ValidationErrors>();
    const [createdCardIndex, setCreatedCardIndex] = useState<number | null>(null);
    const router = useRouter();

    // TODO: use createdCardId instead
    const newCardAdded = useRef(false);

    const nameInputRef = useRef<HTMLInputElement | null>(null);
    const descriptionInputRef = useRef<HTMLInputElement | null>(null);

    const addCard = useCallback(() => {
        setCards([...cards, { ...emptyCard, id: cards[cards.length - 1].id + 1 }]);
        setCreatedCardIndex(cards.length);
        newCardAdded.current = true;
    }, [cards]);

    const deleteCard = (id: number) => {
        if (cards.length !== 1) {
            setCards(cards.filter((_, index) => index !== id));
        }
    }

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
            let redirectModuleId;
            if (initialModule) { // Update
                const termLanguageId = languagesList.find(l => selectedLanguages.term === l.code)?.id || 1;
                const definitionLanguageId = languagesList.find(l => selectedLanguages.definition === l.code)?.id || 1;

                const updatedModule = await updateModuleDB({
                    id: initialModule.id,
                    name,
                    description,
                    cards: sanitizedCards,
                    termLanguageId,
                    definitionLanguageId
                });
                redirectModuleId = updatedModule.id;
            } else { // Create
                const createdModule = await createModuleDB({
                    name,
                    description,
                    cards: sanitizedCards,
                    languages: languagesList,
                    selectedLanguages,
                });
                redirectModuleId = createdModule.id;
            }

            const moduleUrl = `/module/${redirectModuleId}`;
            router.push(moduleUrl);
        }
    }

    // Scroll down
    useEffect(() => {
        if (newCardAdded.current) {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }
        newCardAdded.current = false;
    }, [newCardAdded]);

    useEffect(() => {
        const keyboard = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                const children = document.querySelectorAll(".create__content");
                if (children) {
                    const lastFields = children[children.length - 1].querySelectorAll(".card__field");
                    const lastField = lastFields[lastFields.length - 1];

                    if (document.activeElement === lastField) {
                        addCard();
                    }
                }
            } else if (event.key === "Tab") {
                // Check if focus on the last element
                const children = document.querySelectorAll(".create__content");
                if (children) {
                    const lastFields = children[children.length - 1].querySelectorAll(".card__field");
                    const lastField = lastFields[lastFields.length - 1];

                    if (document.activeElement === lastField) {
                        event.preventDefault();
                        addCard();
                    }
                }
            }
        }

        window.addEventListener("keydown", keyboard);

        return () => {
            window.removeEventListener("keydown", keyboard);
        }
    }, [cards, addCard]);

    const setTermLang = (value: string) => {
        setSelectedLanguages({ ...selectedLanguages, term: value });
    }

    const setDefinitionLang = (value: string) => {
        setSelectedLanguages({ ...selectedLanguages, definition: value });
    }

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
                    <div className={styles.buttonSave} onClick={saveCards}>Save</div>
                </div>
                <div className={styles.languages}>
                    <div className={styles.language}>
                        <Select languages={languagesList}
                            label="Original Language"
                            selectedValue={selectedLanguages.term}
                            setLanguage={setTermLang}
                        />
                    </div>
                    <div className={styles.language}>
                        <Select
                            languages={languagesList}
                            label="Translation Language"
                            selectedValue={selectedLanguages.definition}
                            setLanguage={setDefinitionLang}
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
                        />
                    ))}
                </div>
                <div className={styles.addCard} onMouseDown={(e) => { e.preventDefault(); addCard(); }}>
                    Add Card
                </div>
            </div>
        </main>
    )
}