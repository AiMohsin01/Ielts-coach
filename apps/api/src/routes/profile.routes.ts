import { Router } from "express";
import { z } from "zod";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import type { AuthenticatedRequest } from "../types.js";

const router = Router();
const profileSchema = z.object({
  currentLevel: z.number().min(0).max(9).multipleOf(0.5).nullable(),
  targetBand: z.number().min(0).max(9).multipleOf(0.5).nullable(),
  examDate: z.string().date().nullable(),
  dailyStudyMinutes: z.number().int().min(15).max(720).nullable()
});
// pg returns NUMERIC columns as strings; expose numbers consistently to form clients.
const select = "weak_skills AS \"weakSkills\", current_level::double precision AS \"currentLevel\", target_band::double precision AS \"targetBand\", exam_date AS \"examDate\", daily_study_minutes AS \"dailyStudyMinutes\", onboarding_completed AS \"onboardingCompleted\"";
router.get("/", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try { const result = await pool.query(`SELECT ${select} FROM profiles WHERE user_id = $1`, [req.user!.id]); res.json({ profile: result.rows[0] ?? null }); } catch (e) { next(e); }
});
router.put("/", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try { const p = profileSchema.parse(req.body); const complete = Boolean(p.currentLevel !== null && p.targetBand !== null && p.examDate && p.dailyStudyMinutes !== null);
    const result = await pool.query(`INSERT INTO profiles(user_id,current_level,target_band,exam_date,daily_study_minutes,onboarding_completed) VALUES($6,$1,$2,$3,$4,$5) ON CONFLICT(user_id) DO UPDATE SET current_level=EXCLUDED.current_level,target_band=EXCLUDED.target_band,exam_date=EXCLUDED.exam_date,daily_study_minutes=EXCLUDED.daily_study_minutes,onboarding_completed=EXCLUDED.onboarding_completed RETURNING ${select}`, [p.currentLevel, p.targetBand, p.examDate, p.dailyStudyMinutes, complete, req.user!.id]);
    res.json({ profile: result.rows[0] });
  } catch (e) { if (e instanceof z.ZodError) return res.status(400).json({ message: e.issues[0].message }); next(e); }
});
export default router;
