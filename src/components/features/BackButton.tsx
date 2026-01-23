import { IconAction } from "../UI/IconAction/IconAction";
import { memo, useMemo } from "react";
import { BackIcon } from "@/icons/BackIcon";

interface BackButtonProps {
    onClick: () => void;
}

export const BackButton = memo(({ onClick }: BackButtonProps) => {
    const icon = useMemo(() => <BackIcon />, []);

    return (
        <IconAction
            title="Back"
            onClick={onClick}
            variant="background"
            hoverColor="var(--blue-color-400)"
        >
            {icon}
        </IconAction>
    )
});

BackButton.displayName = "BackButton";