import { IconAction } from "../UI/IconAction/IconAction";
import { memo, useMemo } from "react";
import { ShuffleIcon } from "@/icons/ShuffleIcon";

interface ShuffleButtonProps {
    onClick: () => void;
}

export const ShuffleButton = memo(({ onClick }: ShuffleButtonProps) => {
    const icon = useMemo(() => <ShuffleIcon />, []);

    return (
        <IconAction
            title="Shuffle"
            onClick={onClick}
            variant="background"
            hoverColor="var(--blue-color-400)"
        >
            {icon}
        </IconAction>
    )
});

ShuffleButton.displayName = "ShuffleButton";