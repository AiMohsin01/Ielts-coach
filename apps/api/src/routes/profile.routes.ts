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
const select = "current_level AS \"currentLevel\", target_band AS \"targetBand\", exam_date AS \"examDate\", daily_study_minutes AS \"dailyStudyMinutes\", onboarding_completed AS \"onboardingCompleted\"";
router.get("/", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try { const result = await pool.query(`SELECT ${select} FROM profiles WHERE user_id = $1`, [req.user!.id]); res.json({ profile: result.rows[0] }); } catch (e) { next(e); }
});
router.put("/", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try { const p = profileSchema.parse(req.body); const complete = Boolean(p.currentLevel !== null && p.targetBand !== null && p.examDate && p.dailyStudyMinutes !== null);
    const result = await pool.query(`UPDATE profiles SET current_level=$1,target_band=$2,exam_date=$3,daily_study_minutes=$4,onboarding_completed=$5 WHERE user_id=$6 RETURNING ${select}`, [p.currentLevel, p.targetBand, p.examDate, p.dailyStudyMinutes, complete, req.user!.id]);
    res.json({ profile: result.rows[0] });
  } catch (e) { if (e instanceof z.ZodError) return res.status(400).json({ message: e.issues[0].message }); next(e); }
});
export default router;
