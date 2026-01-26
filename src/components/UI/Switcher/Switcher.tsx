import { memo } from "react";
import Switch from "react-switch";

interface SwitcherProps {
    checked: boolean;
    onChange: () => void;
}

export const Switcher = memo(({ checked, onChange }: SwitcherProps) => {
    return (
        <Switch
            onChange={onChange}
            uncheckedIcon={false}
            checkedIcon={false}
            onColor="#169fcd"
            checked={checked}
        />
    );
});

Switcher.displayName = "Switcher";