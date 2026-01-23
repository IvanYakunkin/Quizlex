import { SwitchSidesButton } from "@/components/features/SwitchSidesButton";
import styles from "./ModuleOptions.module.css";
import { DeleteModuleButton } from "@/components/features/DeleteModuleButton";
import { ReloadButton } from "@/components/features/ReloadButton";
import { memo } from "react";

interface ModuleOptionsProps {
    moduleId: number | string;
    moduleName: string;
    onSwitchSidesClick: () => void;
    onRefreshClick: () => void;
}

export const ModuleOptions = memo(({ moduleId, moduleName, onSwitchSidesClick, onRefreshClick }: ModuleOptionsProps) => {
    return (
        <div className={styles.options}>
            <div className={styles.optionsLeft}>
                <DeleteModuleButton moduleId={moduleId} moduleName={moduleName} />
            </div>

            <div className={styles.optionsRight}>
                <SwitchSidesButton onClick={onSwitchSidesClick} />
                <ReloadButton onClick={onRefreshClick} />
            </div>
        </div>
    );
});

ModuleOptions.displayName = "ModuleOptions";