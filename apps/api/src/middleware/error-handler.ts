import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
export function notFound(_req: Request, res: Response) { res.status(404).json({ message: "Route not found" }); }
export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) { res.status(400).json({ message: error.issues[0]?.message ?? "Please check the submitted fields" }); return; }
  console.error(error);
  res.status(500).json({ message: "An unexpected error occurred" });
}
