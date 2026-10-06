import type { NextFunction, Request, Response } from "express";
import { config } from "../config.js";
const safe = new Set(["GET","HEAD","OPTIONS"]);
export function requireTrustedOrigin(req:Request,res:Response,next:NextFunction){if(safe.has(req.method))return next();const origin=req.get("origin");if(origin && origin !== config.clientUrl)return res.status(403).json({message:"Request origin is not allowed"});next();}
