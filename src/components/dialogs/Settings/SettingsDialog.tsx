import { Select } from "@/components/UI/SelectLanguage/Select";
import { Button } from "../../UI/Button/Button";
import { BaseDialog } from "../BaseDialog/BaseDialog"
import styles from "./SettingsDialog.module.css";
import { Languages, StudySettings } from "@/types/types";
import { useState } from "react";
import { Switcher } from "@/components/UI/Switcher/Switcher";
import { Language } from "@/generated/prisma/browser";
import { Field } from "@/components/UI/WordField/Field";

interface SettingsDialogProps {
    settings: StudySettings;
    isOpen: boolean;
    moduleLanguages: Languages;
    onClose: () => void;
    onSave: (settings: StudySettings) => void;
    onShuffle: () => void;
    onReset: () => void;
}

export const SettingsDialog = ({ settings, isOpen, moduleLanguages, onClose, onSave, onShuffle, onReset }: SettingsDialogProps) => {
    const [languages] = useState<Language[]>(() => [moduleLanguages.term, moduleLanguages.definition])
    const [isPronounce, setIsPronounce] = useState(settings.isPronounce);
    const [isStudyFavorites, setIsStudyFavorites] = useState(settings.isStudyFavorites);
    const [selectedLanguage, setSelectedLanguage] = useState(settings.frontLanguage);
    const [wordsPerRound, setWordsPerRound] = useState<string | number>(settings.wordsPerRound || "");
    //const [trackProgress, setTrackProgress] = useState(undefined); // TODO 

    const saveSettings = () => {

        const newSettings: StudySettings = {
            frontLanguage: selectedLanguage,
            isStudyFavorites,
            isPronounce,
        }

        if (settings.wordsPerRound !== undefined) {
            const isPositiveInteger = /^\d+$/.test(wordsPerRound.toString());
            newSettings.wordsPerRound = isPositiveInteger ? +wordsPerRound : 10;
        }

        onSave(newSettings);
        onClose();
    }

    const changeWordsPerRound = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWordsPerRound(e.target.value);
    }

    const handleShuffling = () => {
        onShuffle();
        saveSettings();
        onClose();
    }

    const handleReset = () => {
        onReset();
        onClose();
    }

    return (
        <BaseDialog
            isOpen={isOpen}
            onClose={onClose}
            title="Settings"
            size="big"
            footerButtons={
                <>
                    <Button onClick={onClose} background="empty">Cancel</Button>
                    <Button width="150px" isBold onClick={saveSettings}>Save</Button>
                </>
            }
        >
            <div className={styles.settings}>
                <div className={styles.setting}>
                    <div className={styles.name}>Front side</div>
                    <div className={styles.value}>
                        <Select
                            dataList={languages}
                            selectedValue={selectedLanguage}
                            changeValue={(newLanguage: Language) => setSelectedLanguage(newLanguage)}
                        />
                    </div>
                </div>

                {settings.wordsPerRound !== undefined &&
                    <div className={styles.setting}>
                        <div className={styles.name}>Words per round</div>
                        <div className={styles.value}>
                            <Field
                                value={wordsPerRound}
                                onChange={changeWordsPerRound}
                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                    e.stopPropagation();
                                }}
                                style={{ textAlign: "center" }}
                            />
                        </div>
                    </div>
                }

                <div className={styles.setting}>
                    <div className={styles.name}>Study only selected words ★</div>
                    <div className={styles.value}>
                        <Switcher
                            onChange={() => { setIsStudyFavorites(prev => !prev) }}
                            checked={isStudyFavorites}
                        />
                    </div>
                </div>

                {/* {trackProgress !== undefined &&
                    <div className={styles.setting}>
                        <div className={styles.name}>Track progress</div>
                        <div className={styles.value}>
                            <Switcher
                                onChange={() => { setTrackProgress(prev => !prev) }}
                                checked={trackProgress}
                            />
                        </div>
                    </div>
                } */}

                <div className={styles.setting}>
                    <div className={styles.name}>Pronounce the term</div>
                    <div className={styles.value}>
                        <Switcher
                            onChange={() => { setIsPronounce(prev => !prev) }}
                            checked={isPronounce}
                        />
                    </div>
                </div>

                <div className={styles.setting} onClick={handleShuffling}>
                    <div className={styles.name + " " + styles.link}>Shuffle cards</div>
                </div>

                <div className={styles.setting} onClick={handleReset}>
                    <div className={styles.name + " " + styles.link + " " + styles.red}>Reset</div>
                </div>
            </div>
        </BaseDialog>
    );
}