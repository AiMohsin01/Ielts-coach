export const locales=["en","bn"] as const;export type Locale=typeof locales[number];
export const copy:{[key:string]:Record<Locale,string>}={home:{en:"Home",bn:"হোম"},practice:{en:"Practice",bn:"অনুশীলন"},coach:{en:"AI Coach",bn:"এআই কোচ"},feedback:{en:"Feedback",bn:"মতামত"}};
export const t=(key:keyof typeof copy,locale:Locale="en")=>copy[key][locale];
