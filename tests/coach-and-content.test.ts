import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { pool } from "../apps/api/src/db/pool.js";
const base=process.env.E2E_BASE_URL??"http://localhost:4000";
test("completed plans survive regeneration, concurrent requests and profile updates; starter content works",async()=>{
  let id="",otherId="";
  const request=(path:string,cookie="",method="GET",body?:unknown)=>fetch(base+path,{method,headers:{"Content-Type":"application/json",...(cookie?{Cookie:cookie}:{})},...(body!==undefined?{body:JSON.stringify(body)}:{})});
  try {
    const register=await request("/api/auth/register","","POST",{name:"Disposable Coach QA",email:"coach-qa-"+randomUUID()+"@example.test",password:randomUUID()});
    assert.equal(register.status,201);id=(await register.json()).user.id;
    const cookie=register.headers.get("set-cookie")!.split(";")[0];
    const profile={currentLevel:5,targetBand:6.5,examDate:"2027-01-01",dailyStudyMinutes:60,weakSkills:["reading"]};
    assert.equal((await request("/api/coach/onboarding",cookie,"PUT",profile)).status,200);
    const initial=(await (await request("/api/coach/dashboard",cookie)).json()).tasks;
    assert.equal(initial[0].taskType,"reading");assert.equal(initial.reduce((s:number,t:any)=>s+t.duration,0),60);
    assert.equal((await request("/api/coach/plan/"+initial[0].id,cookie,"PATCH",{status:"completed"})).status,200);
    const responses=await Promise.all([request("/api/coach/plan/generate",cookie,"POST",{}),request("/api/coach/plan/generate",cookie,"POST",{})]);
    assert.ok(responses.every(r=>r.status===201));
    assert.equal((await request("/api/coach/onboarding",cookie,"PUT",{...profile,weakSkills:["speaking"]})).status,200);
    const after=(await (await request("/api/coach/dashboard",cookie)).json()).tasks;
    assert.deepEqual(after.map((t:any)=>t.id),initial.map((t:any)=>t.id));assert.equal(after[0].status,"completed");
    assert.deepEqual((await (await request("/api/profile",cookie)).json()).profile.weakSkills,["speaking"]);
    const words=(await (await request("/api/coach/vocabulary",cookie)).json()).words;assert.ok(words.length>=24);
    assert.equal((await request("/api/coach/vocabulary/"+words[0].id,cookie,"PATCH",{masteryLevel:3})).status,200);
    for(const skill of ["reading","listening","speaking"]){const list=(await (await request("/api/practice/"+skill+"/tests",cookie)).json()).tests;assert.ok(list.some((t:any)=>t.title.startsWith("Sample")));}
    const reading=(await (await request("/api/practice/reading/tests/11110000-0000-4000-8000-000000000001",cookie)).json()).test;
    const answers=["true","false","not given","advance","wednesday","study","months","false"];
    const submissionId=randomUUID();
    const payload={submissionId,elapsedSeconds:120,answers:reading.passages[0].questions.map((q:any,i:number)=>({questionId:q.id,answer:answers[i]}))};
    const scores=await Promise.all([request("/api/practice/reading/tests/"+reading.id+"/submit",cookie,"POST",payload),request("/api/practice/reading/tests/"+reading.id+"/submit",cookie,"POST",payload)]);
    assert.deepEqual(scores.map(r=>r.status).sort(),[200,201]);
    const score=await scores[0].json();assert.equal(score.attempt.rawScore,8);assert.equal(score.feedback.length,8);assert.ok(score.feedback.every((q:any)=>q.correct&&q.explanation));
    assert.equal((await scores[1].json()).attempt.id,score.attempt.id);
    const history=(await (await request("/api/practice/reading/attempts",cookie)).json()).attempts;
    assert.equal(history.length,1);assert.equal(history[0].rawScore,8);
    const review=(await (await request("/api/practice/reading/attempts/"+score.attempt.id,cookie)).json());assert.equal(review.feedback.length,8);
    assert.equal((await request("/api/practice/reading/attempts/"+score.attempt.id)).status,401);
    const other=await request("/api/auth/register","","POST",{name:"Other Disposable QA",email:"coach-qa-"+randomUUID()+"@example.test",password:randomUUID()});otherId=(await other.json()).user.id;
    const otherCookie=other.headers.get("set-cookie")!.split(";")[0];
    assert.equal((await request("/api/practice/reading/attempts/"+score.attempt.id,otherCookie)).status,404);
    assert.equal((await request("/api/practice/reading/tests/"+reading.id+"/submit",otherCookie,"POST",payload)).status,409);
    const listening=(await (await request("/api/practice/listening/tests/11110000-0000-4000-8000-000000000003",cookie)).json()).test;
    assert.ok(listening.sections[0].transcript.includes("Wednesday"));
    const writing=(await (await request("/api/practice/writing/tasks",cookie)).json()).tasks;assert.ok(writing.length>=3);
    assert.equal((await request("/api/practice/writing/tasks/11110000-0000-4000-8000-000000000005/attempts",cookie,"POST",{responseText:"This is an original sample response saved during a disposable automated test."})).status,201);
    const report=(await (await request("/api/reports/progress",cookie)).json());assert.equal(report.practice.reading[0].rawScore,8);assert.ok(report.practice.writing[0].responseText.includes("disposable automated test"));
    const month=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Dhaka",year:"numeric",month:"2-digit"}).format(new Date());
    const calendar=await request("/api/coach/plan/history?month="+month,cookie);assert.equal(calendar.status,200);assert.ok((await calendar.json()).tasks.some((t:any)=>t.id===initial[0].id));
    const library=(await (await request("/api/library",cookie)).json()).modules;assert.equal(library.length,11);assert.ok(library.every((m:any)=>m.notes.length===4&&m.notesBengali.length===4&&!/[\u0980-\u09ff]/.test(m.description+" "+m.notes.join(" "))));
    assert.equal((await request("/uploads/nonexistent.webm")).status,401);
    assert.equal((await request("/uploads/nonexistent.webm",cookie)).status,404);
  } finally {
    if(id)await pool.query("DELETE FROM users WHERE id=$1 AND email LIKE 'coach-qa-%@example.test'",[id]);
    if(otherId)await pool.query("DELETE FROM users WHERE id=$1 AND email LIKE 'coach-qa-%@example.test'",[otherId]);
    await pool.end();
  }
});
