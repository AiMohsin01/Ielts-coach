import { pool } from "../db/pool.js";
import { buildDailyPlan } from "./daily-plan.js";
export async function generateDailyPlan(userId: string, date: string) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // Serialize double clicks and requests from different tabs for this learner.
    const profileResult = await client.query('SELECT daily_study_minutes AS minutes, weak_skills AS "weakSkills" FROM profiles WHERE user_id=$1 FOR UPDATE', [userId]);
    const existing = await client.query('SELECT id,task_type AS "taskType",task_description AS "taskDescription",duration,status,priority FROM study_plans WHERE user_id=$1 AND date=$2 ORDER BY priority,created_at', [userId, date]);
    if (existing.rowCount) {
      await client.query("COMMIT");
      return existing.rows;
    }
    const profile = profileResult.rows[0];
    if (!profile?.minutes) throw new Error("Complete your learning profile before creating a plan");
    const results = await client.query("SELECT 'writing' skill,AVG(overall_band) score FROM writing_evaluations e JOIN writing_attempts a ON a.id=e.attempt_id WHERE a.user_id=$1 UNION ALL SELECT 'speaking',AVG(overall_band) FROM speaking_evaluations e JOIN speaking_attempts a ON a.id=e.attempt_id WHERE a.user_id=$1", [userId]);
    const scores = Object.fromEntries(results.rows.filter(r => r.score !== null).map(r => [r.skill, Number(r.score)]));
    const tasks = buildDailyPlan(Number(profile.minutes), profile.weakSkills ?? [], scores);
    const saved = [];
    for (const task of tasks) {
      const result = await client.query('INSERT INTO study_plans(user_id,date,task_type,task_description,duration,priority) VALUES($1,$2,$3,$4,$5,$6) RETURNING id,task_type AS "taskType",task_description AS "taskDescription",duration,status,priority', [userId, date, task.type, task.description, task.duration, task.priority]);
      saved.push(result.rows[0]);
    }
    await client.query("COMMIT");
    return saved;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally { client.release(); }
}
export async function refreshRecommendations(userId: string) {
  const weak = await pool.query("SELECT skill,category,label,occurrence_count AS count FROM student_weaknesses WHERE user_id=$1 ORDER BY occurrence_count DESC,last_seen_at DESC LIMIT 3", [userId]);
  for (const item of weak.rows) {
    const type = item.skill + "_improvement";
    const reason = item.label + " has appeared " + item.count + " times in your feedback.";
    await pool.query("INSERT INTO recommendations(user_id,type,reason,content) SELECT $1,$2,$3,$4 WHERE NOT EXISTS (SELECT 1 FROM recommendations WHERE user_id=$1 AND type=$2 AND reason=$3 AND created_at >= NOW() - INTERVAL '1 day')", [userId, type, reason, JSON.stringify({ skill: item.skill, category: item.category, action: "Practice " + item.label })]);
  }
  return weak.rows;
}
