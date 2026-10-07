import { VocabularyDeck } from "../../../../components/vocabulary-deck";
export default async function Page({params}:{params:Promise<{topic:string}>}){const {topic}=await params;return <VocabularyDeck initialTopic={topic}/>;}
