import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { pool } from "../db/pool.js";
import type { AuthenticatedRequest, AuthUser, UserRole } from "../types.js";

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).json({ message: "Authentication required" });
    const claims = jwt.verify(token, config.jwtSecret) as AuthUser;
    const result = await pool.query("SELECT id,name,email,role FROM users WHERE id=$1", [claims.id]);
    if (!result.rowCount) return res.status(401).json({ message: "Session is invalid or expired" });
    req.user = result.rows[0] as AuthUser;
    return next();
  } catch { return res.status(401).json({ message: "Session is invalid or expired" }); }
}
export function requireRole(...roles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ message: "Insufficient permissions" });
    next();
  };
}
