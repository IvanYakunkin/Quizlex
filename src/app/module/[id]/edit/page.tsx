import { ModuleForm } from "@/components/ModuleForm/ModuleForm";
import { authOptions } from "@/lib/auth";
import { getLanguages } from "@/services/languageActions";
import { findUserModuleAction } from "@/services/moduleActions";
import { mapDbModuleToApp } from "@/types/mappers/mapDbModuleToApp";
import { getServerSession, Session } from "next-auth";
import { notFound } from "next/navigation";

export default async function EditPage({ params }: { params: Promise<{ id: number }> }) {
    const { id } = await params;

    const session: Session | null = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        notFound();
    }

    const userModule = await findUserModuleAction(+id);

    if (!userModule) {
        notFound();
    }
    const moduleForUI = mapDbModuleToApp(userModule);

    const languages = await getLanguages();

    return (
        <ModuleForm languagesList={languages} initialModule={moduleForUI} />
    );
}