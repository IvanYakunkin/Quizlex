import { ReloadIcon } from "@/icons/ReloadIcon";
import { IconAction } from "../UI/IconAction/IconAction";
import { memo, useMemo } from "react";

interface ReloadButtonProps {
    onClick: () => void;
}

export const ReloadButton = memo(({ onClick }: ReloadButtonProps) => {
    const icon = useMemo(() => <ReloadIcon />, []);

    return (
        <IconAction
            title="Reload"
            onClick={onClick}
            variant="background"
            hoverColor="var(--blue-color-400)"
        >
            {icon}
        </IconAction>
    )
});

ReloadButton.displayName = "ReloadButton";