import { SwitchSidesIcon } from "@/icons/SwitchSidesIcon";
import { IconAction } from "../UI/IconAction/IconAction"
import { memo, useMemo } from "react";

interface SwitchSidesButtonProps {
    onClick: () => void;
}

export const SwitchSidesButton = memo(({ onClick }: SwitchSidesButtonProps) => {
    const icon = useMemo(() => <SwitchSidesIcon />, []);

    return (
        <IconAction onClick={onClick} variant="background" hoverColor="var(--blue-color-400)">
            {icon}
        </IconAction>
    );
});

SwitchSidesButton.displayName = "SwitchSidesButton";