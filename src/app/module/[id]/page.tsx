import { findModuleById } from "@/services/moduleService";
import Module from "../components/Module";

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>
}) {

    const { id } = await params;

    const moduleData = await findModuleById(id);

    return (
        <Module moduleData={moduleData} />
    );
}