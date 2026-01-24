import { LearningType } from "@/types/types";
import { LearningPage } from "@/app/learn/components/LearningPage";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { findUserModuleAction } from "@/services/moduleActions";
import { mapDbModuleToApp } from "@/types/mappers/mapDbModuleToApp";

export default async function Page({
  params,
}: {
  params: Promise<{ id: number, learningType: LearningType }>
}) {
  const moduleId = (await params).id;
  const learningType = (await params).learningType;

  if (!learningType || (learningType !== "writing" &&
    learningType !== "cards" &&
    learningType !== "match" &&
    learningType !== "test")) {

    notFound();
  }

  const session: Session | null = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    notFound();
  }

  const userModule = await findUserModuleAction(+moduleId);

  if (!userModule) {
    notFound();
  }

  const moduleForUI = mapDbModuleToApp(userModule);

  return (
    <LearningPage learningType={learningType} module={moduleForUI} />
  );
}