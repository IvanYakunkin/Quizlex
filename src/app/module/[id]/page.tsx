import { findUserModuleById, UserModule } from "@/services/moduleService";
import { getServerSession, Session } from "next-auth";
import { notFound } from "next/navigation";
import { Module } from "../components/Module/Module";
import { authOptions } from "@/lib/auth";

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

  const userModule: UserModule = await findUserModuleById(+session.user.id, +id);
  if (!userModule) notFound();

  return (
    <Module userModule={userModule} />
  );
}