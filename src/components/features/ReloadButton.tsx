import { ReloadIcon } from "@/icons/ReloadIcon";
import { IconAction } from "../UI/IconAction/IconAction";

interface ReloadButtonProps {
    onClick: () => void;
}

export const ReloadButton = ({ onClick }: ReloadButtonProps) => {
    return (
        <IconAction
            title="Reload"
            onClick={onClick}
            variant="background"
            hoverColor="var(--blue-color-400)"
        >
            <ReloadIcon />
        </IconAction>
    )
}