import Image from "next/image";
import styles from "../page.module.css";
import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";

interface LearningHeaderProps{
    moduleName?: string;
    moduleId?: number;
    changeLanguage: boolean;
    setChangeLanguage: Dispatch<SetStateAction<boolean>>;
}

const LearningHeader = (props: LearningHeaderProps) => {
    const router = useRouter();

    const toHome = () => {
        if(props.moduleId){
            router.push(`/module/${props.moduleId}`);
        }else{
            router.push("/module/");
        }
    }

    return (
        <div className={styles.info}>
            <div className={`${styles.headerBtn}`} onClick={toHome}><Image src="/images/home.png" width={24} height={24} alt="Quit" /></div>
            <div className={styles.set}>{props.moduleName ? props.moduleName : "Your Set"}</div>
            <div className={`${styles.headerBtn}`} onClick={() => props.setChangeLanguage(!props.changeLanguage)}>
                <svg version="1.1" id="Layer_1" viewBox="0 0 472.615 472.615">
                    <g> 
                        <g><path d="M355.232,0l-13.525,13.525l65.821,65.821h-279.17c-52.894,0-95.924,43.031-95.924,95.919v59.633h19.128v-59.633
                            c0-42.343,34.452-76.79,76.796-76.79h279.17l-65.821,65.821l13.525,13.525l88.91-88.91L355.232,0z"/>
                        </g>
                    </g>
                    <g>
                        <g>
                            <path d="M421.053,237.714v59.632c0,42.344-34.452,76.795-76.796,76.795H65.087l65.821-65.825l-13.525-13.525l-88.909,88.914
                            l88.909,88.91l13.525-13.525L65.087,393.27h279.17c52.895,0,95.924-43.031,95.924-95.924v-59.632H421.053z"/>
                        </g>
                    </g>
                </svg>
            </div>
        </div>
    );
}

export default LearningHeader;