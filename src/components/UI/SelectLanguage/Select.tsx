import styles from "./Select.module.css";
import { memo } from "react";

interface SelectProps<T> {
    selectedValue: T;
    changeValue: (newValue: T) => void;
    dataList: T[];
    label?: string;
}

export interface BaseItem {
    id: number | string;
    name: string;
}

const SelectComponent = <T extends BaseItem>(props: SelectProps<T>) => {
    const changeSelectedElement = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const foundElement = props.dataList.find(l => l.id === +e.target.value);
        if (foundElement) {
            props.changeValue(foundElement);
        }
    }

    const selectContainer = (
        <div className={styles.selectContainer}>
            {props.label && <label className={styles.selectLabel}>{props.label}</label>}
            <select className={styles.selectTag} value={props.selectedValue.id} onChange={changeSelectedElement}>
                {props.dataList.map((el, index) => (
                    <option value={el.id} key={index}>{el.name}</option>
                ))}
            </select>
        </div>
    );

    return (
        <div className={styles.selectLanguage}>
            {selectContainer}
        </div>
    );
};

export const Select = memo(SelectComponent) as <T extends BaseItem>(
    props: SelectProps<T>
) => React.ReactElement;