import { Router } from "express";
import { z } from "zod";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import type { AuthenticatedRequest } from "../types.js";
import { libraryModules, youtubeId } from "../services/library-catalog.js";
const router = Router();
router.use(requireAuth);
async function catalog() {
  const resources = await pool.query('SELECT title,youtube_url,skill,topic FROM youtube_resources WHERE is_published=TRUE ORDER BY created_at');
  return libraryModules.map(module => {
    const videos = [...module.videos];
    for (const resource of resources.rows) {
      const id = youtubeId(resource.youtube_url);
      if (id && module.slug.endsWith(`-${resource.skill.toLowerCase()}`) && !videos.some(v => v.id === id)) videos.push({ id, title: resource.title, channel: "Community resource · see YouTube for creator", topic: resource.topic });
    }
    return { ...module, videos };
  });
}
router.get("/", async (req: AuthenticatedRequest, res, next) => {
  try { const [modules, progress, notes] = await Promise.all([catalog(), pool.query('SELECT module_slug AS "moduleSlug",video_id AS "videoId",completed FROM library_progress WHERE user_id=$1',[req.user!.id]),pool.query('SELECT module_slug AS "moduleSlug",note FROM library_notes WHERE user_id=$1',[req.user!.id])]); res.json({ modules, progress: progress.rows, notes: notes.rows }); } catch (e) { next(e); }
});
router.put("/:module/progress/:video", async (req: AuthenticatedRequest, res, next) => {
  try { const { completed } = z.object({ completed: z.boolean() }).parse(req.body); const module = (await catalog()).find(m => m.slug === req.params.module);
    if (!module?.videos.some(v => v.id === req.params.video)) return res.status(404).json({ message: "Lesson not found" });
    await pool.query('INSERT INTO library_progress(user_id,module_slug,video_id,completed) VALUES($1,$2,$3,$4) ON CONFLICT(user_id,module_slug,video_id) DO UPDATE SET completed=$4,updated_at=NOW()',[req.user!.id,module.slug,req.params.video,completed]);
    if(completed) await pool.query("INSERT INTO library_activity(user_id,study_date) VALUES($1,(NOW() AT TIME ZONE 'Asia/Dhaka')::date) ON CONFLICT DO NOTHING",[req.user!.id]);
    res.json({ completed });
  } catch (e) { next(e); }
});
router.put("/:module/notes", async (req: AuthenticatedRequest, res, next) => {
  try { const { note } = z.object({ note: z.string().max(10000) }).parse(req.body); if (!libraryModules.some(m => m.slug === req.params.module)) return res.status(404).json({ message: "Module not found" });
    await pool.query('INSERT INTO library_notes(user_id,module_slug,note) VALUES($1,$2,$3) ON CONFLICT(user_id,module_slug) DO UPDATE SET note=$3,updated_at=NOW()',[req.user!.id,req.params.module,note]); res.json({ saved: true });
  } catch (e) { next(e); }
});
router.get("/activity", async (req: AuthenticatedRequest, res, next) => {
  try { const rows = await pool.query("SELECT to_char(study_date,'YYYY-MM-DD') AS date FROM library_activity WHERE user_id=$1 ORDER BY study_date DESC",[req.user!.id]); res.json({ activity: rows.rows }); } catch (e) { next(e); }
});
export default router;
