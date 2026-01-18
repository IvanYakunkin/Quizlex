import Image from "next/image";
import styles from "./ModuleOptions.module.css";

interface ModuleOptionsProps {
    onEditClick: (value: boolean) => void;
    onDeleteClick: (value: boolean) => void;
    onSwitchSidesClick: () => void;
    onRefreshClick: () => void;
}

export const ModuleOptions = ({ onEditClick, onDeleteClick, onSwitchSidesClick, onRefreshClick }: ModuleOptionsProps) => {
    return (
        <div className={styles.options}>
            <div className={styles.optionsLeft}>
                <div className={styles.option} onClick={() => onEditClick(true)}>
                    <Image src="/images/pen-white.png" width={15} height={15} alt="Edit" title="Edit module" />
                </div>
                <div className={styles.option} onClick={() => onDeleteClick(true)}>
                    <Image src="/images/trash-can.png" width={15} height={15} alt="Delete" title="Delete module" />
                </div>
            </div>

            <div className={styles.optionsRight}>
                <div className={`${styles.option} ${styles.switch}`} onClick={onSwitchSidesClick} title="Switch the front side">
                    <svg version="1.1" id="Layer_1" viewBox="0 0 472.615 472.615">
                        <g>
                            <g><path d="M355.232,0l-13.525,13.525l65.821,65.821h-279.17c-52.894,0-95.924,43.031-95.924,95.919v59.633h19.128v-59.633
                                        c0-42.343,34.452-76.79,76.796-76.79h279.17l-65.821,65.821l13.525,13.525l88.91-88.91L355.232,0z" stroke="white" strokeWidth={"20"} />
                            </g>
                        </g>
                        <g>
                            <g>
                                <path d="M421.053,237.714v59.632c0,42.344-34.452,76.795-76.796,76.795H65.087l65.821-65.825l-13.525-13.525l-88.909,88.914
                                        l88.909,88.91l13.525-13.525L65.087,393.27h279.17c52.895,0,95.924-43.031,95.924-95.924v-59.632H421.053z" stroke="white" strokeWidth={"20"} />
                            </g>
                        </g>
                    </svg>
                </div>
                <div className={`${styles.option} ${styles.switch}`} onClick={onRefreshClick} title="Refresh">
                    <svg version="1.1" id="Capa_1" viewBox="0 0 76.398 76.398">
                        <g><path d="M58.828,16.208l-3.686,4.735c7.944,6.182,11.908,16.191,10.345,26.123C63.121,62.112,48.954,72.432,33.908,70.06
                                    C18.863,67.69,8.547,53.522,10.912,38.477c1.146-7.289,5.063-13.694,11.028-18.037c5.207-3.79,11.433-5.613,17.776-5.252
                                    l-5.187,5.442l3.848,3.671l8.188-8.596l0.002,0.003l3.668-3.852L46.39,8.188l-0.002,0.001L37.795,0l-3.671,3.852l5.6,5.334
                                    c-7.613-0.36-15.065,1.853-21.316,6.403c-7.26,5.286-12.027,13.083-13.423,21.956c-2.879,18.313,9.676,35.558,27.989,38.442
                                    c1.763,0.277,3.514,0.411,5.245,0.411c16.254-0.001,30.591-11.85,33.195-28.4C73.317,35.911,68.494,23.73,58.828,16.208z" />
                        </g>
                    </svg>
                </div>
            </div>
        </div>
    );
}