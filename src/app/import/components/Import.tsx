"use client"
import { Card } from "@/types/types";
import { useState } from "react";
import styles from "../page.module.css";
import ImportArea from "./ImportArea";
import CardsPreview from "@/components/UI/CardsPreview/CardsPreview";
import { Language } from "@/generated/prisma";

interface ImportProps{
    languages: Language[];
}

export default function Import(props: ImportProps) {
    const [previewCards, setPreviewCards] = useState<Card[]>([]);
    
    return (
        <main className="main">                                     
           <div className={styles.importContent}>
                <div className={styles.title}>Import words</div>
                <ImportArea previewCards={previewCards} setPreviewCards={setPreviewCards} languages={props.languages} />
                <CardsPreview cards={previewCards} title="Module Preview" showNumbers={true} />
           </div>
        </main>
    );
}