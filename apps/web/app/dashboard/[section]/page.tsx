import { notFound } from "next/navigation";
import { WorkspaceTools } from "../../../components/workspace-tools";
const sections=["study-plan","mock-tests","part-practice","ai-calling","ai-rewriter","ai-expert-teacher","vocabulary","grammar","typing-speed","my-reports","streaks","leaderboard","subscriptions","tutorials","support","refer-earn"];
export default async function Page({params}:{params:Promise<{section:string}>}){const {section}=await params;if(!sections.includes(section))notFound();return <WorkspaceTools section={section}/>;}
