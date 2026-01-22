import { IconAction } from "../UI/IconAction/IconAction";
import { playSound } from "@/utils/audio/playSound";
import { VolumeIcon } from "@/icons/VolumeIcon";

interface FavoriteButtonProps {
    word: string;
    language: string;
    size?: number;
    strokeWidth?: number;
}

export const SoundButton = ({ word, language, size, strokeWidth }: FavoriteButtonProps) => (
    <IconAction
        title="Sound"
        onClick={() => playSound(word, language)}
        hoverColor="var(--blue-color-400)"
        size={size}
        strokeWidth={strokeWidth}
    >
        <VolumeIcon />
    </IconAction>
);