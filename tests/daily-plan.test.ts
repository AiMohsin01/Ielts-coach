import test from "node:test";
import assert from "node:assert/strict";
import { buildDailyPlan, studyDate } from "../apps/api/src/services/daily-plan.js";
import {buildRoadmapDay,roadmapDates} from "../apps/api/src/services/roadmap.js";
import {expandedVocabulary} from "../shared/vocabulary-catalog.js";
import {additionalVocabularyGroups,additionalTopicDescriptions} from "../shared/vocabulary-expansion.js";
import {vocabularyGuide,topicDescriptions} from "../apps/web/lib/vocabulary-guide.js";
test("plans respect every supported budget and database duration bounds", () => {
  for (let minutes = 15; minutes <= 720; minutes++) {
    const tasks = buildDailyPlan(minutes);
    assert.equal(tasks.reduce((sum, task) => sum + task.duration, 0), minutes);
    assert.ok(tasks.every(task => task.duration >= 5 && task.duration <= 240));
    assert.equal(new Set(tasks.map(task => task.type + ":" + task.description)).size, tasks.length);
  }
});
test("plans honour selected weaknesses and recorded scores", () => {
  assert.equal(buildDailyPlan(60, ["reading"])[0].type, "reading");
  assert.equal(buildDailyPlan(60, [], { speaking: 4, writing: 6 })[0].type, "speaking");
  assert.throws(() => buildDailyPlan(0));
});
test("study dates follow Bangladesh midnight", () => {
  assert.equal(studyDate(new Date("2026-10-07T18:01:00Z")), "2026-10-08");
});
test("roadmaps rotate real activities, honour time budgets and stop before exam day",()=>{
  assert.deepEqual(roadmapDates("2026-10-08","2026-10-11"),["2026-10-08","2026-10-09","2026-10-10"]);
  assert.throws(()=>roadmapDates("2026-10-08","2026-10-08"));
  assert.throws(()=>roadmapDates("2026-10-08","2028-10-08"));
  const focus=new Set<string>();
  for(const minutes of [15,30,45,60,90,120,720])for(let day=0;day<28;day++){
    const tasks=buildRoadmapDay(minutes,["reading"],day,28);focus.add(tasks[0].type);
    assert.equal(tasks.reduce((sum,t)=>sum+t.duration,0),minutes);
    assert.ok(tasks.every(t=>t.href.startsWith("/")&&!t.href.startsWith("//")&&t.title&&t.reason));
    assert.equal(new Set(tasks.map(t=>t.type+":"+t.description)).size,tasks.length);
  }
  assert.ok(["reading","writing","listening","speaking","grammar","vocabulary"].every(s=>focus.has(s)));
  assert.equal(buildRoadmapDay(60,[],0,28)[0].phase,"Foundation");
  assert.equal(buildRoadmapDay(60,[],14,28)[0].phase,"Skill practice");
  assert.equal(buildRoadmapDay(60,[],27,28)[0].phase,"Review & readiness");
});
test("expanded vocabulary has complete original entries and unique words",()=>{
  assert.equal(expandedVocabulary.length,276);
  assert.equal(new Set(expandedVocabulary.map(w=>w.word)).size,276);
  assert.equal(new Set(expandedVocabulary.map(w=>w.topic)).size,31);
  assert.ok(expandedVocabulary.every(w=>w.meaning&&w.exampleSentence&&w.part&&w.bengali&&w.collocations.length===2&&w.synonyms[0]));
  assert.ok(expandedVocabulary.every(w=>["Beginner","Intermediate","Advanced"].includes(w.level)&&w.usageNote));
  assert.equal(Object.values(additionalVocabularyGroups).reduce((sum,group)=>sum+group.split("\n").length,0),216);
  assert.equal(Object.keys(additionalTopicDescriptions).length,18);
  for(const topic of Object.keys(additionalTopicDescriptions)){
    assert.equal(expandedVocabulary.filter(w=>w.topic===topic).length,10);
  }
  assert.match(expandedVocabulary.find(w=>w.word==="accommodation")!.usageNote,/uncountable/);
  assert.equal(Object.keys(vocabularyGuide).length,300);
  const topics=new Set(Object.values(vocabularyGuide).map(w=>w.topic));
  assert.equal(topics.size,33);
  assert.ok([...topics].every(topic=>topicDescriptions[topic]));
});
