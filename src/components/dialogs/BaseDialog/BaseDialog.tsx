import { useEffect, useRef, ReactNode } from "react";
import Draggable from "react-draggable";
import styles from "./BaseDialog.module.css";
import { CloseButton } from "@/components/features/CloseButton";

interface BaseDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    footerButtons?: ReactNode;
    size?: 'small' | 'big';
}

export const BaseDialog = ({ isOpen, onClose, title, children, footerButtons, size = 'small' }: BaseDialogProps) => {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.paddingRight = `${scrollBarWidth}px`;
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.paddingRight = '';
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={styles.dialog}>
            <Draggable nodeRef={wrapperRef} handle=".drag-handle" cancel=".cancel-drag">
                <div className={`${styles.container} ${styles[size]}`} ref={wrapperRef}>
                    <div className={`${styles.header} drag-handle`}>
                        <div className={styles.title}>{title}</div>
                        <div className={`${styles.close} cancel-drag`} onClick={onClose}>
                            <CloseButton onBtnClick={onClose} />
                        </div>
                    </div>

                    <div className={styles.info}>
                        {children}
                    </div>

                    {footerButtons && (
                        <div className={styles.buttons}>
                            {footerButtons}
                        </div>
                    )}
                </div>
            </Draggable>
        </div>
    );
};