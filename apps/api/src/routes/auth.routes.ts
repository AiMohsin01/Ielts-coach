import { Router, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { config } from "../config.js";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import type { AuthenticatedRequest, AuthUser } from "../types.js";

const router = Router();
const credentials = z.object({ name: z.string().trim().min(2).max(120), email: z.string().trim().email().max(255), password: z.string().min(8).max(72) });
const loginSchema = credentials.pick({ email: true, password: true });
const cookie = { httpOnly: true, secure: config.isProduction, sameSite: "lax" as const, maxAge: 1000 * 60 * 60 * 24 * 7, path: "/" };
const publicUser = (u: AuthUser) => ({ id: u.id, name: u.name, email: u.email, role: u.role });
function issue(res: Response, user: AuthUser) { const token = jwt.sign(user, config.jwtSecret, { expiresIn: "7d" }); res.cookie("auth_token", token, cookie); }

router.post("/register", async (req, res, next) => {
  try {
    const data = credentials.parse(req.body); const email = data.email.toLowerCase();
    const exists = await pool.query("SELECT 1 FROM users WHERE email = $1", [email]);
    if (exists.rowCount) return res.status(409).json({ message: "An account with this email already exists" });
    const passwordHash = await bcrypt.hash(data.password, 12);
    const result = await pool.query("INSERT INTO users(name,email,password_hash) VALUES($1,$2,$3) RETURNING id,name,email,role", [data.name, email, passwordHash]);
    const user = result.rows[0] as AuthUser; await pool.query("INSERT INTO profiles(user_id) VALUES($1)", [user.id]); issue(res, user);
    return res.status(201).json({ user: publicUser(user) });
  } catch (e) { if (e instanceof z.ZodError) return res.status(400).json({ message: e.issues[0].message }); next(e); }
});
router.post("/login", async (req, res, next) => {
  try { const data = loginSchema.parse(req.body); const result = await pool.query("SELECT id,name,email,password_hash,role FROM users WHERE email = $1", [data.email.toLowerCase()]); const row = result.rows[0];
    if (!row || !(await bcrypt.compare(data.password, row.password_hash))) return res.status(401).json({ message: "Invalid email or password" });
    const user: AuthUser = { id: row.id, name: row.name, email: row.email, role: row.role }; issue(res, user); return res.json({ user: publicUser(user) });
  } catch (e) { if (e instanceof z.ZodError) return res.status(400).json({ message: "Enter a valid email and password" }); next(e); }
});
router.post("/logout", (_req, res) => { res.clearCookie("auth_token", { path: "/" }); res.status(204).send(); });
router.get("/me", requireAuth, (req: AuthenticatedRequest, res) => res.json({ user: publicUser(req.user!) }));
export default router;
