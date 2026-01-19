import { ModuleForm } from "@/components/ModuleForm/ModuleForm";
import { getLanguages } from "@/services/languageActions";

export default async function CreatePage() {
    const languages = await getLanguages();
    return (
        <ModuleForm languagesList={languages} />
    );
}