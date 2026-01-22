import { SwitchSides } from "@/icons/SwitchSides"
import { IconAction } from "../UI/IconAction/IconAction"

interface SwitchSidesButtonProps {
    onClick: () => void;
}

export const SwitchSidesButton = ({ onClick }: SwitchSidesButtonProps) => {
    return (
        <IconAction onClick={onClick} variant="background" hoverColor="var(--blue-color-400)">
            <SwitchSides />
        </IconAction>
    )
}