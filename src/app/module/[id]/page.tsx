import { getServerSession, Session } from "next-auth";
import { notFound } from "next/navigation";
import { Module } from "../components/Module/Module";
import { authOptions } from "@/lib/auth";
import { DbModule } from "@/types/module";
import { findUserModuleAction } from "@/services/moduleActions";
import { mapDbModuleToApp } from "@/types/mappers/mapDbModuleToApp";

export default async function ModulePage({
  params,
}: {
  params: Promise<{ id: number }>
}) {
  const { id } = await params;
  const session: Session | null = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    notFound();
  }

  const userModule: DbModule | null = await findUserModuleAction(+id)
  if (!userModule) notFound();

  const moduleForUI = mapDbModuleToApp(userModule);

  return (
    <Module initialModule={moduleForUI} />
  );
}