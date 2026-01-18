"use client"

import Module from "./Module";
import styles from "../page.module.css";
import { useState } from "react";
import Link from "next/link";
import { ModuleWithCount } from "@/types/types";

interface ModulesProps {
    modules: ModuleWithCount[];
}

const Modules = ({ modules }: ModulesProps) => {
    const [searchValue, setSearchValue] = useState("");
    const [modulesShown, setModulesShown] = useState(modules);

    const searchModule = (value: string) => {
        setSearchValue(value)
        if (value.trim() === "") {
            setModulesShown(modules);
        } else {
            setModulesShown(modules.filter(module => module.name.toUpperCase().includes(value.toUpperCase())));
        }
    }

    return (
        <div className={styles.content}>
            <div className={styles.options}>
                <div className={styles.search}>
                    <input type="text" value={searchValue} onChange={(e) => searchModule(e.target.value)} placeholder="Searching..." />
                </div>
                <Link href={"/module/create"} className={`${styles.createBtn} ${styles.darkgreen}`}><span>Create</span></Link>
                <Link href={"/import"} className={styles.createBtn}><span>Import</span></Link>
            </div>
            <div className={styles.collection}>
                {modulesShown.length > 0 && modulesShown.map(module => (
                    <Module module={module} key={module.id} />
                ))}
                {modulesShown.length === 0 &&
                    <p>No Modules Found</p>
                }
            </div>
        </div>
    )
}

export default Modules;