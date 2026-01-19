"use client"

import { useEffect, useRef } from "react";
import styles from "./windows.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { deleteModuleAction } from "@/services/moduleActions";

interface DeleteWinProps {
    moduleId: number | string;
    onClose: () => void,
}

export const DeleteWin = (props: DeleteWinProps) => {
    const { status } = useSession();
    const router = useRouter();

    const deleteModule = async () => {
        if (status === "authenticated") {
            if (Number.isInteger(props.moduleId)) {
                await deleteModuleAction(+props.moduleId);
                router.push("/modules");
            }
        } else {
            localStorage.removeItem('module');
            router.push("/");
        }
    }

    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                props.onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [props]);

    return (
        <div className={styles.popup}>
            <div className={styles.container} ref={wrapperRef}>
                <div className={styles.close} onClick={props.onClose}>
                    <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z" fill="currentColor" />
                    </svg>
                </div>
                <div className={styles.info}>
                    <div className={styles.title}>Delete this module?</div>
                    <div className={styles.module}>Your module</div>
                    <div className={styles.warning}><div>Are you sure that you want to delete this module? It will be deleted forever.</div><div><b>This action cannot be undone!</b></div></div>
                </div>
                <div className={styles.buttons}>
                    <div className={styles.btnCancel} onClick={props.onClose}>Cancel</div>
                    <div className={styles.btnConfirm} onClick={deleteModule}>Yes, delete module</div>
                </div>
            </div>
        </div>
    );
}