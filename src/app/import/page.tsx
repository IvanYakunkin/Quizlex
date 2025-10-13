import { getLanguages } from "@/services/languageService";
import Import from "./components/Import";

export default async function Page() {

    const languages = await getLanguages();

    return (
        <Import languages={languages} />
    )
}