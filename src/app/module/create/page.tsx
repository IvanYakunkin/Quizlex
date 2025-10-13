import { getLanguages } from "@/services/languageService";
import Create from "./components/Create"

const Page = async () => {
    const languages = await getLanguages();
    return (
        <Create languages={languages} />
    );
}

export default Page;