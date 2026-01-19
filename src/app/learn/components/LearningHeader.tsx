import styles from "../page.module.css";
import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";

interface LearningHeaderProps {
    moduleName?: string;
    moduleId?: number | string;
    changeLanguage: boolean;
    setChangeLanguage: Dispatch<SetStateAction<boolean>>;
}

export const LearningHeader = (props: LearningHeaderProps) => {
    const router = useRouter();

    const toHome = () => {
        if (props.moduleId && !isNaN(+props.moduleId)) {
            router.push(`/module/${props.moduleId}`);
        } else {
            router.push("/module/");
        }
    }

    return (
        <div className={styles.info}>
            <div className={`${styles.headerBtn}`} onClick={toHome}>
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z" clipRule="evenodd" />
                </svg>
            </div>
            <div className={styles.set}>{props.moduleName ? props.moduleName : "Your Set"}</div>
            <div className={`${styles.headerBtn}`} onClick={() => props.setChangeLanguage(!props.changeLanguage)}>
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3" />
                </svg>

            </div>
        </div>
    );
}