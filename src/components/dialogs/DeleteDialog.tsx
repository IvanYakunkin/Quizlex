"use client"

import { useState } from "react";
import styles from "./windows.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { deleteModuleAction } from "@/services/moduleActions";
import { Spinner } from "../UI/Spinner/Spinner";
import { BaseDialog } from "./BaseDialog/BaseDialog";
import { Button } from "../UI/Button/Button";

interface DeleteDialogProps {
    isOpen: boolean;
    moduleId: number | string;
    moduleName: string;
    onClose: () => void,
}

export const DeleteDialog = (props: DeleteDialogProps) => {
    const { status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const deleteModule = async () => {
        if (isLoading) return;
        setIsLoading(true);
        if (status === "authenticated") {
            if (Number.isInteger(props.moduleId)) {
                await deleteModuleAction(+props.moduleId);
                router.push("/modules");
            }
        } else {
            localStorage.removeItem('module');
            router.push("/");
        }
        setIsLoading(false);
    }

    return (
        <BaseDialog
            isOpen={props.isOpen}
            onClose={props.onClose}
            title="Delete this module?"
            footerButtons={
                <>
                    <Button onClick={props.onClose} background="empty">Cancel</Button>
                    <Button onClick={deleteModule} background="error">
                        {isLoading ? <Spinner outerColor="#b35c5c" innerColor="white" /> : "Yes, delete module"}
                    </Button>
                </>
            }
        >
            <div className={styles.gap}>
                <div className={styles.module}>{props.moduleName}</div>
                <div className={styles.warning}><div>Are you sure that you want to delete this module? It will be deleted forever.</div><div><b>This action cannot be undone!</b></div></div>
            </div>
        </BaseDialog>
    );
}