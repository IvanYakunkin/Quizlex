"use client"

import styles from "../page.module.css";
import { useState } from "react";
import Link from "next/link";
import { DbModuleWithCount } from "@/types/module";
import { Module } from "./Module";

export const Modules = ({ modules }: { modules: DbModuleWithCount[] }) => {
    const [searchValue, setSearchValue] = useState("");

    const filteredModules = modules.filter(module =>
        module.name.toUpperCase().includes(searchValue.toUpperCase())
    );

    return (
        <div className={styles.content}>
            <div className={styles.options}>
                <div className={styles.search}>
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Searching..."
                    />
                </div>
                <Link href={"/module/create"} className={`${styles.createBtn} ${styles.darkgreen}`}><span>Create</span></Link>
                <Link href={"/import"} className={styles.createBtn}><span>Import</span></Link>
            </div>
            <div className={styles.collection}>
                {filteredModules.length > 0 ? (
                    filteredModules.map(module => (
                        <Module module={module} key={module.id} />
                    ))
                ) : (
                    <p>No Modules Found</p>
                )}
            </div>
        </div>
    )
}