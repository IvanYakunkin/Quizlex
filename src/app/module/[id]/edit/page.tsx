import { ModuleForm } from "@/components/ModuleForm/ModuleForm";
import { authOptions } from "@/lib/auth";
import { getLanguages } from "@/services/languageService";
import { findUserModuleById } from "@/services/moduleService";
import { getServerSession, Session } from "next-auth";
import { notFound } from "next/navigation";

export default async function EditPage({ params }: { params: Promise<{ id: number }> }) {
    const { id } = await params;

    const session: Session | null = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        notFound();
    }

    const userModule = await findUserModuleById(+id, +session.user.id);
    if (!userModule) {
        notFound();
    }

    const languages = await getLanguages();

    return (
        <ModuleForm languagesList={languages} initialModule={userModule} />
    );
}