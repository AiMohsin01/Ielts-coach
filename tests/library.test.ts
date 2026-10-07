import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { pool } from "../apps/api/src/db/pool.js";
import { libraryModules, youtubeId } from "../apps/api/src/services/library-catalog.js";
const base=process.env.E2E_BASE_URL??"http://localhost:4000";
test("all library modules have unique valid YouTube lessons and original notes",()=>{
  assert.equal(libraryModules.length,11);assert.equal(new Set(libraryModules.map(m=>m.slug)).size,11);
  for(const module of libraryModules){assert.ok(module.notes.length>=4);assert.ok(module.videos.length>=5);assert.equal(new Set(module.videos.map(v=>v.id)).size,module.videos.length);for(const video of module.videos){assert.equal(youtubeId(`https://www.youtube.com/watch?v=${video.id}`),video.id);assert.ok(video.title&&video.channel&&video.topic);}}
});
test("YouTube parser rejects misleading domains and unsupported URLs",()=>{
  assert.equal(youtubeId("https://youtu.be/j16s7ay3Bsw?t=20"),"j16s7ay3Bsw");assert.equal(youtubeId("https://www.youtube-nocookie.com/embed/j16s7ay3Bsw"),"j16s7ay3Bsw");
  for(const url of ["https://youtube.com.evil.test/watch?v=j16s7ay3Bsw","https://evil.test/youtube.com?v=j16s7ay3Bsw","http://www.youtube.com/watch?v=j16s7ay3Bsw","https://youtube.com/watch?v=example","not-a-url"])assert.equal(youtubeId(url),null);
});
test("library progress, private notes, leaderboard and typing persist with authentication",async()=>{
  const users:string[]=[];
  const call=(path:string,cookie="",method="GET",body?:unknown)=>fetch(`${base}${path}`,{method,headers:{"Content-Type":"application/json",...(cookie?{Cookie:cookie}:{})},...(body!==undefined?{body:JSON.stringify(body)}:{})});
  async function account(){const response=await call("/api/auth/register","","POST",{name:"Disposable Library QA",email:`library-qa-${randomUUID()}@example.test`,password:randomUUID()});assert.equal(response.status,201);const data=await response.json() as {user:{id:string}};users.push(data.user.id);return response.headers.get("set-cookie")!.split(";")[0];}
  try{
    assert.equal((await call("/api/library")).status,401);
    const a=await account(),b=await account();const initial=await (await call("/api/library",a)).json() as {modules:typeof libraryModules;progress:unknown[];notes:unknown[]};assert.equal(initial.modules.length,11);assert.equal(initial.progress.length,0);
    assert.equal((await call("/api/library/00-introduction/progress/j16s7ay3Bsw",a,"PUT",{completed:true})).status,200);
    assert.equal((await call("/api/library/00-introduction/progress/j16s7ay3Bsw",a,"PUT",{completed:true})).status,200);
    const after=await (await call("/api/library",a)).json() as {progress:{completed:boolean}[]};assert.equal(after.progress.length,1);assert.equal(after.progress[0].completed,true);
    assert.equal((await call("/api/library/00-introduction/progress/invalid",a,"PUT",{completed:true})).status,404);
    assert.equal((await call("/api/library/00-introduction/progress/j16s7ay3Bsw",a,"PUT",{completed:"true"})).status,400);
    assert.equal((await call("/api/library/00-introduction/notes",a,"PUT",{note:"Private QA note"})).status,200);
    const isolated=await (await call("/api/library",b)).json() as {progress:unknown[];notes:unknown[]};assert.equal(isolated.progress.length,0);assert.equal(isolated.notes.length,0);
    const own=await (await call("/api/library",a)).json() as {notes:{note:string}[]};assert.equal(own.notes[0].note,"Private QA note");
    const activity=await (await call("/api/library/activity",a)).json() as {activity:{date:string}[]};assert.equal(activity.activity.length,1);
    const board=await (await call("/api/tools/leaderboard",a)).json() as {settings:{visible:boolean}};assert.equal(board.settings.visible,false);
    assert.equal((await call("/api/tools/leaderboard",a,"PUT",{displayName:"Disposable QA alias",visible:true})).status,200);
    const joined=await (await call("/api/tools/leaderboard",b)).json() as {entries:{displayName:string;points:number}[]};assert.equal(joined.entries.find(x=>x.displayName==="Disposable QA alias")?.points,10);
    assert.equal((await call("/api/tools/typing",a,"POST",{wpm:40,accuracy:97.5})).status,201);
    const typing=await (await call("/api/tools/typing",a)).json() as {results:{wpm:number}[]};assert.equal(typing.results[0].wpm,40);
    assert.equal((await call("/api/tools/typing",a,"POST",{wpm:-1,accuracy:110})).status,400);
    assert.equal((await call("/api/library/00-introduction/progress/j16s7ay3Bsw",a,"PUT",{completed:false})).status,200);
    assert.equal((await call("/api/tools/leaderboard",a,"PUT",{displayName:"Disposable QA alias",visible:false})).status,200);
  }finally{for(const id of users)await pool.query("DELETE FROM users WHERE id=$1 AND email LIKE 'library-qa-%@example.test'",[id]);await pool.end();}
});
