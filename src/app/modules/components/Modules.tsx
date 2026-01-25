"use client"

import styles from "../page.module.css";
import { useState } from "react";
import { DbModuleWithCount } from "@/types/module";
import { Module } from "./Module";
import { Button } from "@/components/UI/Button/Button";

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
                <div className={styles.btns}>
                    <div className={styles.btn}>
                        <Button href="/module/create" size="full" isBold>Create</Button>
                    </div>
                    <div className={styles.btn}>
                        <Button href="/import" size="full" background="primary" isBold>Import</Button>
                    </div>
                </div>
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