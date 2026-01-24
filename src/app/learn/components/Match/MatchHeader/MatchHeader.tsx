import { CloseButton } from "@/components/features/CloseButton";
import styles from "./MatchHeader.module.css";
import { VolumeIcon } from "@/icons/VolumeIcon";
import { memo, RefObject, useCallback, useRef, useState } from "react";
import { NoVolumeIcon } from "@/icons/NoVolumeIcon";
import { IconAction } from "@/components/UI/IconAction/IconAction";

interface MatchHeaderProps {
    onClose: () => void;
    timerRef: RefObject<HTMLDivElement | null>;
    middleValue?: string;
}

export const MatchHeader = memo(({ onClose, timerRef, middleValue }: MatchHeaderProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const playMusic = useCallback(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        } else {
            audioRef.current.volume = 0.6;
            audioRef.current.play();
        }

        setIsPlaying(!isPlaying);
    }, [isPlaying]);

    return (
        <div className={styles.header}>
            <div className={styles.left}>
                <audio
                    ref={audioRef}
                    src="/audio/drive.mp3"
                    onEnded={() => {
                        audioRef.current!.currentTime = 0;
                        audioRef.current!.play();
                    }}
                />
                <IconAction onClick={playMusic} hoverColor="var(--blue-color-400)" variant="background">
                    {isPlaying ? <VolumeIcon /> : <NoVolumeIcon />}
                </IconAction>
            </div>
            <div className={styles.middle} ref={timerRef}>{middleValue}</div>
            <div className={styles.right}>
                <CloseButton onBtnClick={onClose} size={28} />
            </div>
        </div>
    )
});

MatchHeader.displayName = "MatchHeader";