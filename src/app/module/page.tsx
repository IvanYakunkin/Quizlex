"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Module } from "./components/Module/Module";
import { AppModule } from "@/types/module";

export default function ModulePage() {
    const router = useRouter();
    const [moduleData, setModuleData] = useState<AppModule | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const localRawModule = localStorage.getItem("module");

        if (localRawModule) {
            try {
                const parsedModule: AppModule = JSON.parse(localRawModule);
                setModuleData(parsedModule);
            } catch (error) {
                console.error("Error parsing module:", error);
                router.push("/import");
            } finally {
                setIsLoading(false);
            }
        } else {
            router.push("/import");
        }
    }, [router]);

    if (isLoading) {
        return <div></div>;
    }
    return (
        <Module initialModule={moduleData!} />
    );
}