// TODO: Add functionality for studying other people's modules

import { LearningType } from "@/types/types";
import LearningPage from "../components/LearningPage";

export default async function Page({
  params,
}: {
  params: Promise<{ learningType: LearningType }>
}) {

    const learningType = (await params).learningType;
  
    return (
        <LearningPage learningType={learningType} />
    );
}
