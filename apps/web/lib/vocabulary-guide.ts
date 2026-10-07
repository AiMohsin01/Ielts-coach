// Original study notes for the starter catalogue, not copied from a commercial deck.
export type WordGuide = { topic:string; bengali:string; collocations:string[]; part:string; level:string; mistake?:string };
const row=(topic:string,bengali:string,collocations:string[],part="verb",level="Intermediate",mistake?:string):WordGuide=>({topic,bengali,collocations,part,level,mistake});
export const vocabularyGuide:Record<string,WordGuide>={
  adapt:row("Education & Learning","মানিয়ে নেওয়া",["adapt to change","adapt a method"],"verb","Beginner","Use ‘adapt to a situation’, not ‘adapt with a situation’."),
  assess:row("Education & Learning","মূল্যায়ন করা",["assess progress","assess the evidence"]),
  beneficial:row("Education & Learning","উপকারী",["beneficial effects","beneficial to learners"],"adjective","Beginner","Use ‘beneficial to someone’ or ‘beneficial for something’."),
  coherent:row("Education & Learning","সুসংগত ও স্পষ্ট",["a coherent argument","a coherent explanation"],"adjective","Advanced"),
  enhance:row("Education & Learning","উন্নত করা",["enhance understanding","enhance the quality"]),
  evidence:row("Education & Learning","প্রমাণ",["strong evidence","provide evidence"],"noun","Beginner","‘Evidence’ is uncountable: say ‘some evidence’, not ‘an evidence’."),
  reliable:row("Education & Learning","বিশ্বাসযোগ্য",["a reliable source","reliable information"],"adjective","Beginner"),
  perspective:row("Society & Communication","দৃষ্টিভঙ্গি",["a fresh perspective","from another perspective"],"noun"),
  diverse:row("Society & Communication","বৈচিত্র্যময়",["a diverse community","diverse backgrounds"],"adjective"),
  widespread:row("Society & Communication","ব্যাপক",["widespread support","widespread concern"],"adjective"),
  considerable:row("Society & Communication","উল্লেখযোগ্য পরিমাণে",["considerable effort","considerable support"],"adjective"),
  inevitable:row("Society & Communication","অনিবার্য",["an inevitable change","an inevitable consequence"],"adjective","Advanced"),
  allocate:row("Work & Public Policy","বরাদ্দ করা",["allocate resources","allocate time to study"]),
  efficient:row("Work & Public Policy","দক্ষ ও সাশ্রয়ী",["an efficient system","efficient use of time"],"adjective","Beginner","‘Efficient’ means avoiding waste; ‘effective’ means achieving the intended result."),
  feasible:row("Work & Public Policy","বাস্তবায়নযোগ্য",["a feasible proposal","financially feasible"],"adjective","Advanced"),
  implement:row("Work & Public Policy","বাস্তবায়ন করা",["implement a policy","implement a plan"]),
  consequence:row("Environment & Change","পরিণতি বা ফলাফল",["a serious consequence","as a consequence"],"noun"),
  mitigate:row("Environment & Change","তীব্রতা কমানো",["mitigate the impact","mitigate a risk"],"verb","Advanced"),
  sustainable:row("Environment & Change","টেকসই",["sustainable development","sustainable transport"],"adjective"),
  predominant:row("Environment & Change","প্রধান বা সর্বাধিক প্রচলিত",["the predominant cause","a predominant feature"],"adjective","Advanced"),
  decline:row("Charts & Trends","হ্রাস পাওয়া",["a steady decline","decline gradually"],"verb / noun"),
  fluctuate:row("Charts & Trends","ওঠানামা করা",["fluctuate between values","prices fluctuate"],"verb","Advanced","Use ‘fluctuate between A and B’ when describing two limits."),
  significant:row("Charts & Trends","উল্লেখযোগ্য",["a significant increase","a significant difference"],"adjective"),
  trend:row("Charts & Trends","প্রবণতা",["an upward trend","a long-term trend"],"noun","Beginner"),
};
export const topicDescriptions:Record<string,string>={
  "Education & Learning":"Words for study habits, evidence, clear arguments and lifelong learning.",
  "Society & Communication":"Discuss different communities, viewpoints and changes in society.",
  "Work & Public Policy":"Describe resources, practical decisions and plans at work or in government.",
  "Environment & Change":"Explain sustainability, causes, consequences and ways to reduce risks.",
  "Charts & Trends":"Describe increases, decreases, variation and important patterns in data.",
};
export const topicSlug=(topic:string)=>topic.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
