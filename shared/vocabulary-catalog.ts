// Original teaching definitions and examples, independently written for IELTS Coach.
import { additionalVocabularyGroups } from "./vocabulary-expansion.js";
import { thousandVocabulary } from "./vocabulary-thousand.js";
const groups:Record<string,string>={
"Aging & Population":`ageing|the process of becoming older|The town is planning services for its ageing population.|noun / adjective|বয়স বৃদ্ধি|an ageing population;healthy ageing|growing older
elderly|older people, or relating to older age|The centre offers activities for elderly residents.|adjective|বয়স্ক|elderly residents;elderly relatives|older
longevity|the length of a life or the ability to last a long time|Better living conditions can contribute to longevity.|noun|দীর্ঘায়ু|increased longevity;human longevity|long life
retirement|the period after leaving regular paid work|She took up painting after retirement.|noun|অবসর|early retirement;retirement age|leaving work
demographic|relating to the characteristics of a population|Demographic changes affect demand for housing.|adjective|জনসংখ্যা সম্পর্কিত|demographic change;demographic data|population-related
generation|people born and living around the same period|Each generation may have different attitudes to work.|noun|প্রজন্ম|a younger generation;future generations|age group`,
"Health & Wellbeing":`preventive|intended to stop a problem before it happens|Preventive measures can reduce the spread of illness.|adjective|প্রতিরোধমূলক|preventive care;preventive measures|protective
sedentary|involving a great deal of sitting and little physical movement|A sedentary routine can leave little time for exercise.|adjective|বসে থাকার প্রবণতাযুক্ত|a sedentary lifestyle;sedentary work|inactive
nutrition|the food and nutrients needed for health and growth|Children learn about nutrition in the school garden.|noun|পুষ্টি|balanced nutrition;nutrition education|nourishment
wellbeing|a person's condition of health and happiness|Regular breaks can support students' wellbeing.|noun|সুস্থতা ও ভালো থাকা|mental wellbeing;employee wellbeing|welfare
resilience|the ability to recover after difficulty|Supportive friendships can help develop resilience.|noun|ঘুরে দাঁড়ানোর সক্ষমতা|build resilience;emotional resilience|adaptability
hygiene|practices that help maintain cleanliness and health|The kitchen staff follow strict hygiene procedures.|noun|স্বাস্থ্যবিধি|personal hygiene;food hygiene|cleanliness`,
"Technology & Innovation":`automation|using machines or software to carry out tasks with less human effort|Automation has changed how orders are processed.|noun|স্বয়ংক্রিয়করণ|industrial automation;process automation|mechanisation
innovation|a new idea or method that is put to useful work|The competition encourages innovation in product design.|noun|উদ্ভাবন|technological innovation;encourage innovation|invention
privacy|the ability to keep personal information or activities from unwanted access|Users should understand the app's privacy settings.|noun|গোপনীয়তা|protect privacy;privacy concerns|confidentiality
accessible|possible to reach, obtain or use|The new website is accessible from a mobile phone.|adjective|সহজে ব্যবহার বা পৌঁছানো যায় এমন|accessible information;accessible design|available
obsolete|no longer useful or commonly used because something newer has replaced it|Some old devices become obsolete when support ends.|adjective|অপ্রচলিত|obsolete equipment;become obsolete|outdated
digital|using electronic systems to store or process information|The library offers digital resources alongside printed books.|adjective|ডিজিটাল|digital skills;digital resources|electronic`,
"Cities & Housing":`urbanisation|the growth of towns and cities and the movement of people into them|Rapid urbanisation creates demand for new housing.|noun|নগরায়ণ|rapid urbanisation;urbanisation trends|city growth
infrastructure|the basic systems and facilities needed for a place to function|The city is improving its transport infrastructure.|noun|অবকাঠামো|public infrastructure;transport infrastructure|basic facilities
affordable|priced so that people can reasonably pay for it|Students need affordable accommodation near the campus.|adjective|সাশ্রয়ী|affordable housing;affordable prices|reasonably priced
congestion|a condition in which a place is too crowded for easy movement|The new bus route aims to reduce traffic congestion.|noun|যানজট বা অতিরিক্ত ভিড়|traffic congestion;reduce congestion|overcrowding
residential|used mainly as a place for people to live|The council created a park in a residential area.|adjective|আবাসিক|a residential area;residential development|housing-related
renovation|work that repairs and improves an existing building|The theatre closed temporarily for renovation.|noun|সংস্কার|building renovation;renovation work|refurbishment`,
"Travel & Transport":`commute|travel regularly between home and work or study|Many students commute by train.|verb / noun|নিয়মিত যাতায়াত|a daily commute;commute to work|travel regularly
destination|the place to which someone is travelling|The coastal town became a popular holiday destination.|noun|গন্তব্য|a tourist destination;reach a destination|endpoint
pedestrian|a person travelling on foot|The crossing gives pedestrians a safer route.|noun|পথচারী|pedestrian safety;a pedestrian crossing|walker
itinerary|a plan listing the places and times of a journey|Our itinerary includes two days in the capital.|noun|ভ্রমণসূচি|a travel itinerary;plan an itinerary|travel plan
emissions|substances released into the air|Cleaner transport can help reduce vehicle emissions.|plural noun|নিঃসরণ|carbon emissions;vehicle emissions|released pollutants
fare|the price paid for a journey on public transport|The bus fare is lower for students.|noun|যাতায়াতের ভাড়া|a bus fare;pay the fare|travel charge`,
"Food & Agriculture":`cultivate|prepare land and grow crops, or develop a skill|Farmers cultivate vegetables on the nearby land.|verb|চাষ করা|cultivate crops;cultivate a habit|grow
harvest|collect a crop, or the crop that is collected|The farmers harvested the rice before heavy rain arrived.|verb / noun|ফসল কাটা|harvest crops;a good harvest|gather crops
irrigation|supplying water to land so crops can grow|The farm uses irrigation during dry periods.|noun|সেচ|an irrigation system;drip irrigation|artificial watering
fertile|able to support strong plant growth|The valley has fertile soil.|adjective|উর্বর|fertile soil;fertile land|productive
yield|the amount of a product that is produced|The new method increased the crop yield.|noun / verb|উৎপাদনের পরিমাণ|crop yield;an annual yield|output
organic|grown or produced using methods that avoid certain artificial chemicals|The market has a section for organic produce.|adjective|জৈব|organic farming;organic produce|naturally produced`,
"Arts & Culture":`heritage|traditions, buildings or objects passed down from earlier generations|The museum helps preserve local cultural heritage.|noun|ঐতিহ্য|cultural heritage;preserve heritage|legacy
contemporary|belonging to the present period|The gallery displays contemporary art.|adjective|সমসাময়িক|contemporary art;contemporary society|modern
exhibition|a public display of art or other objects|Students visited an exhibition of local photographs.|noun|প্রদর্শনী|an art exhibition;hold an exhibition|display
preserve|keep something safe from loss or damage|Residents want to preserve the historic cinema.|verb|সংরক্ষণ করা|preserve traditions;preserve a building|protect
craftsmanship|skill in making things carefully by hand|The furniture shows excellent craftsmanship.|noun|দক্ষ কারুশিল্প|skilled craftsmanship;traditional craftsmanship|workmanship
identity|the characteristics that make a person or group distinctive|Language can be an important part of cultural identity.|noun|পরিচয়|cultural identity;a sense of identity|distinctive character`,
"Science & Research":`hypothesis|a possible explanation that can be tested|The experiment was designed to test the hypothesis.|noun|পরীক্ষাযোগ্য ধারণা|test a hypothesis;a working hypothesis|proposed explanation
empirical|based on observation or experiment rather than only theory|The argument needs empirical evidence.|adjective|পর্যবেক্ষণ বা পরীক্ষা নির্ভর|empirical evidence;empirical research|observation-based
variable|a factor that can change in a study or situation|The researchers changed only one variable at a time.|noun|পরিবর্তনশীল বিষয়|a key variable;control a variable|changeable factor
replicate|repeat a study or process to check whether results are similar|Another team tried to replicate the experiment.|verb|পুনরায় করা|replicate a study;replicate results|repeat
correlation|a relationship in which two things tend to change together|The study found a correlation but did not establish a cause.|noun|পারস্পরিক পরিবর্তনের সম্পর্ক|a strong correlation;correlation between variables|association
sample|a selected part of a larger group used for examination|The survey included a sample of local residents.|noun|নমুনা|a representative sample;a small sample|subset`,
"Employment & Careers":`recruit|find and employ people for a job|The company plans to recruit more engineers.|verb|নিয়োগ করা|recruit staff;recruit graduates|hire
qualification|an achievement or credential showing knowledge or skill|The job requires a relevant qualification.|noun|যোগ্যতা বা সনদ|professional qualifications;academic qualifications|credential
flexible|able to change to suit different needs|Flexible hours help some employees manage family commitments.|adjective|নমনীয়|flexible working;flexible hours|adaptable
collaborate|work with others towards a shared aim|The two teams collaborated on the project.|verb|সহযোগিতায় কাজ করা|collaborate with colleagues;collaborate on a project|cooperate
workload|the amount of work someone is expected to do|The manager reviewed each employee's workload.|noun|কাজের চাপ বা পরিমাণ|a heavy workload;manage workload|volume of work
promotion|movement to a higher position at work|Her promotion brought new responsibilities.|noun|পদোন্নতি|earn a promotion;a career promotion|advancement`,
"Economy & Finance":`inflation|a general rise in prices over a period|Inflation can reduce what a fixed income can buy.|noun|মূল্যস্ফীতি|rising inflation;an inflation rate|price growth
investment|money, time or effort put into something to gain a future benefit|Investment in training can improve staff skills.|noun|বিনিয়োগ|public investment;investment in education|commitment of resources
expenditure|the amount of money spent|The report compares household expenditure on food and transport.|noun|ব্যয়|household expenditure;public expenditure|spending
revenue|money received by an organisation, especially from its activities|Ticket sales provide revenue for the theatre.|noun|আয়|generate revenue;annual revenue|income
incentive|something that encourages a person to act|Discounts can provide an incentive to travel outside busy hours.|noun|প্রণোদনা|a financial incentive;offer an incentive|encouragement
scarcity|a situation in which there is not enough of something|Water scarcity affects several communities in the region.|noun|স্বল্পতা|resource scarcity;water scarcity|shortage`,
};
export const expandedVocabulary = [...Object.entries(groups), ...Object.entries(additionalVocabularyGroups)]
  .flatMap(([topic, text]) => text.split("\n").map(line => {
    const [word, meaning, exampleSentence, part, bengali, phrases, synonym, studyLevel, usageTip] = line.split("|");
    return {
      word, meaning, exampleSentence, topic, part, bengali,
      collocations: phrases.split(";"), synonyms: [synonym],
      level: studyLevel || (["longevity", "demographic", "empirical", "replicate", "craftsmanship", "scarcity", "hypothesis"].includes(word) ? "Advanced" : "Intermediate"),
      usageNote: usageTip || "Synonyms are meaning guides, not automatic replacements. Check the grammar and context in your own sentence.",
    };
  })).concat(thousandVocabulary);
