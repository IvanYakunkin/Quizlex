// TODO: Add functionality for studying other people's modules

import { findModuleById } from "@/services/moduleService";
import { LearningType } from "@/types/types";
import LearningPage from "@/app/learn/components/LearningPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: number, learningType: LearningType }>
}) {
    const moduleId = (await params).id;
    const learningType = (await params).learningType;

    const wordsModule = await findModuleById(moduleId);
    if(!wordsModule){
        throw new Error("Unable to find the module");
    }
   
    return (
        <LearningPage learningType={learningType} module={wordsModule} />
    );
}