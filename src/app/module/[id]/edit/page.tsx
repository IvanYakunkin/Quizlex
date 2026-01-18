import { ModuleForm } from "@/components/ModuleForm/ModuleForm";
import { getLanguages } from "@/services/languageService";
import { findModuleById } from "@/services/moduleService";
import { notFound } from "next/navigation";

export default async function EditPage({ params }: { params: Promise<{ id: number }> }) {
    const { id } = await params;
    const wordsModule = await findModuleById(id);
    if (!wordsModule) {
        notFound();
    }
    const languages = await getLanguages();

    return (
        <ModuleForm languagesList={languages} initialModule={wordsModule} />
    );
}