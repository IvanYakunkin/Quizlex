import { IconAction } from "../UI/IconAction/IconAction";
import { playSound } from "@/utils/audio/playSound";
import { VolumeIcon } from "@/icons/VolumeIcon";
import { memo, useMemo } from "react";

interface FavoriteButtonProps {
    word: string;
    language: string;
    size?: number;
    strokeWidth?: number;
}

export const SoundButton = memo(({ word, language, size, strokeWidth }: FavoriteButtonProps) => {
    const icon = useMemo(() => <VolumeIcon />, []);
    return (
        <IconAction
            title="Sound"
            onClick={() => playSound(word, language)}
            hoverColor="var(--blue-color-400)"
            size={size}
            strokeWidth={strokeWidth}
        >
            {icon}
        </IconAction>
    );
});

SoundButton.displayName = "SoundButton";