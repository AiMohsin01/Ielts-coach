import { ContentLibrary } from "../../../../components/content-library";
export default async function Page({params}:{params:Promise<{module:string}>}) {const {module}=await params;return <ContentLibrary slug={module}/>;}
