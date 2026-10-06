import type { Request } from "express";
export type UserRole = "student" | "admin" | "content_manager";
export interface AuthUser { id: string; email: string; role: UserRole; name: string }
export interface AuthenticatedRequest extends Request { user?: AuthUser }
