import { useState, useRef, useCallback, memo } from "react";
import { ImportTextarea } from "@/components/UI/ImportTextarea/ImportTextarea";
import { ISeparators, ValidationErrors } from "@/types/types";
import { Select } from "@/components/UI/SelectLanguage/Select";
import { Separators } from "./Separators";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { validateAndSanitize } from "@/utils/module/validateModule";
import { Language } from "@/generated/prisma/browser";
import { CreateCardInput, CreateModuleInput } from "@/types/module";
import { createModuleAction } from "@/services/moduleActions";
import { mapLocalModuleToApp } from "@/types/mappers/mapLocalModuleToApp";
import styles from "../page.module.css";
import { Spinner } from "@/components/UI/Spinner/Spinner";

interface ImportAreaProps {
    previewCards: CreateCardInput[];
    changeCards: (newCards: CreateCardInput[]) => void;
    languages: Language[];
}

const separators: ISeparators[] = [
    { name: "Tab", value: "\t" },
    { name: "Space", value: " " },
    { name: ",", value: "," },
    { name: "-", value: "-" },
];

export const ImportArea = memo((props: ImportAreaProps) => {
    const router = useRouter();
    const { status } = useSession();
    const [activeSeparatorId, setActiveSeparatorId] = useState<number>(0);
    const [selectedTermLang, setSelectedTermLang] = useState<Language>(props.languages[0]);
    const [selectedDefLang, setSelectedDefLang] = useState<Language>(props.languages[0]);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<ValidationErrors>();

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);
    const descriptionInputRef = useRef<HTMLInputElement>(null);

    const saveWords = async () => {
        const name = nameInputRef.current?.value || "";
        const description = descriptionInputRef.current?.value || "";

        setButtonLoading(true);

        const { isValid, errors, sanitizedCards } = validateAndSanitize(name, description, props.previewCards);
        if (!isValid) {
            fillErrors(errors);
            setButtonLoading(false);
            return;
        }

        if (nameInputRef.current && descriptionInputRef.current) {

            const newModule: CreateModuleInput = {
                name,
                description,
                termLanguageId: selectedTermLang.id,
                definitionLanguageId: selectedDefLang.id,
                cards: sanitizedCards,
            }

            if (status === "authenticated") {
                const moduleResponse = await createModuleAction(newModule);

                if (moduleResponse.error || !moduleResponse.data) {
                    alert(`Error: ${moduleResponse.error}`);
                    return;
                }

                if (moduleResponse) {
                    const moduleUrl = `/module/${moduleResponse.data.id}`;
                    router.push(moduleUrl);
                }

            } else {
                const appModule = mapLocalModuleToApp(newModule, props.languages);
                appModule.isLocal = true;
                localStorage.setItem('module', JSON.stringify(appModule));
                router.push("/module");
            }
        }

        setButtonLoading(false);
    }

    const fillErrors = (errors: ValidationErrors) => {
        setFormErrors(errors);
        if (errors.name) nameInputRef.current?.focus();
        else if (errors.description) descriptionInputRef.current?.focus();
        else if (errors.cards) {
            textareaRef.current?.focus();
            alert(errors.cards);
        }

        return false;
    }

    const changeTermLang = useCallback((newLang: Language) => {
        setSelectedTermLang(newLang);
    }, []);

    const changeDefLang = useCallback((newLang: Language) => {
        setSelectedDefLang(newLang);
    }, []);

    return (
        <div className={styles.importArea}>
            <div className={styles.infoFields}>
                <input type="text"
                    ref={nameInputRef}
                    className={!formErrors?.name
                        ? styles.moduleField
                        : `${styles.moduleField} ${styles.error}`
                    }
                    placeholder='Name'
                />
                <input
                    type='text'
                    ref={descriptionInputRef}
                    className={!formErrors?.description
                        ? styles.moduleField
                        : `${styles.moduleField} ${styles.error}`
                    }
                    placeholder='Description'
                />
            </div>
            <div className={styles.languages}>
                <div className={styles.language}>
                    <Select
                        label="Original Language"
                        languages={props.languages}
                        selectedLanguage={selectedTermLang}
                        changeLanguage={changeTermLang}
                    />
                </div>
                <div className={styles.language}>
                    <Select
                        label="Translation Language"
                        languages={props.languages}
                        selectedLanguage={selectedDefLang}
                        changeLanguage={changeDefLang}
                    />
                </div>
            </div>

            <div className={styles.info}><b>Paste</b> your words here and learn!</div>

            <div className={styles.importContainer}>
                <div className={styles.areaContent}>

                    <ImportTextarea
                        separator={separators[activeSeparatorId].value}
                        changeCards={props.changeCards}
                        textareaRef={textareaRef}
                    />

                    <div className={styles.menu}>
                        <Separators
                            separators={separators}
                            activeSeparatorId={activeSeparatorId}
                            setActiveSeparatorId={setActiveSeparatorId}
                        />
                        <button className={`${styles.baseButton} ${styles.buttonSave}`} onClick={saveWords}>{buttonLoading
                            ?
                            <Spinner />
                            :
                            <div className={styles.buttonSaveContent}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" /><path d="M10 14a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M14 4l0 4l-6 0l0 -4" />
                                </svg>
                                <span>Save</span>
                            </div>

                        }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

ImportArea.displayName = "ImportArea";