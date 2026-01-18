import { getLanguages } from "@/services/languageService";
import { ModuleForm } from "@/components/ModuleForm/ModuleForm";

export default async function CreatePage() {
    const languages = await getLanguages();
    return (
        <ModuleForm languagesList={languages} />
    );
}