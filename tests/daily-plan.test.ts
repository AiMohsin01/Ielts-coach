import test from "node:test";
import assert from "node:assert/strict";
import { buildDailyPlan, studyDate } from "../apps/api/src/services/daily-plan.js";
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
