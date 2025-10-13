import styles from "./Select.module.css";
import { Language } from "@/generated/prisma";

interface SelectProps {
    selectedValue: string;
    setLanguage: (value: string) => void;
    label: string;
    languages: Language[];
}

const Select = (props: SelectProps) => {
    const selectContainer = (
        <div className={styles.selectContainer}>
            <label className={styles.selectLabel}>{props.label}</label>
            <select className={styles.selectTag} value={props.selectedValue} onChange={(e:React.ChangeEvent<HTMLSelectElement>) => props.setLanguage(e.target.value)}>
                {props.languages.map(el => (
                    <option value={el.code} key={el.id}>{el.name}</option>
                ))}
            </select>
        </div>
    );

    return (
        <div className={styles.selectLanguage}>
           {selectContainer}
        </div>
    )
}

export default Select;