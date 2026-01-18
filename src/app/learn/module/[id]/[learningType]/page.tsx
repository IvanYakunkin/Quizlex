import { LearningType } from "@/types/types";
import LearningPage from "@/app/learn/components/LearningPage";
import { getServerSession, Session } from "next-auth";
import { findUserModuleById, UserModule } from "@/services/moduleService";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: number, learningType: LearningType }>
}) {
  const moduleId = (await params).id;
  const learningType = (await params).learningType;

  const session: Session | null = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    notFound();
  }

  const userModule: UserModule = await findUserModuleById(+session.user.id, +moduleId);
  if (!userModule) {
    notFound();
  }

  return (
    <LearningPage learningType={learningType} module={userModule} />
  );
}