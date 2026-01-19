import { useState, useRef } from "react";
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

export const ImportArea = (props: ImportAreaProps) => {
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
                        changeLanguage={(newLanguage: Language) => setSelectedTermLang(newLanguage)}
                    />
                </div>
                <div className={styles.language}>
                    <Select
                        label="Translation Language"
                        languages={props.languages}
                        selectedLanguage={selectedDefLang}
                        changeLanguage={(newLanguage: Language) => setSelectedDefLang(newLanguage)}
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
                        <div className={`${styles.baseButton} ${styles.buttonSave}`} onClick={saveWords}>{buttonLoading
                            ?
                            <Spinner />
                            :
                            <span>Save</span>
                        }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}