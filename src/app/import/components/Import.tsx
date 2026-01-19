"use client"
import { ImportArea } from "./ImportArea";
import { CardsPreview } from "@/components/UI/CardsPreview/CardsPreview";
import { Language } from "@/generated/prisma/browser";
import { CreateCardInput } from "@/types/module";
import styles from "../page.module.css";
import { useState } from "react";

interface ImportProps {
    languages: Language[];
}

export default function Import(props: ImportProps) {
    const [previewCards, setPreviewCards] = useState<CreateCardInput[]>([]);

    return (
        <main className="main">
            <div className={styles.importContent}>
                <div className={styles.title}>Import words</div>

                <ImportArea
                    previewCards={previewCards}
                    changeCards={setPreviewCards}
                    languages={props.languages}
                />

                <CardsPreview
                    cards={previewCards}
                    title="Module Preview"
                    showNumbers={true}
                />
            </div>
        </main>
    );
}