import { Language } from "@/generated/prisma/browser";
import styles from "./Select.module.css";
import { memo } from "react";

interface SelectProps {
    selectedLanguage: Language;
    changeLanguage: (newLanguage: Language) => void;
    label: string;
    languages: Language[];
}

export const Select = memo((props: SelectProps) => {
    const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const foundLanguage = props.languages.find(l => l.id === +e.target.value);
        if (foundLanguage) {
            props.changeLanguage(foundLanguage);
        }
    }

    const selectContainer = (
        <div className={styles.selectContainer}>
            <label className={styles.selectLabel}>{props.label}</label>
            <select className={styles.selectTag} value={props.selectedLanguage.id} onChange={changeLanguage}>
                {props.languages.map(el => (
                    <option value={el.id} key={el.id}>{el.name}</option>
                ))}
            </select>
        </div>
    );

    return (
        <div className={styles.selectLanguage}>
            {selectContainer}
        </div>
    );
});

Select.displayName = "Select";