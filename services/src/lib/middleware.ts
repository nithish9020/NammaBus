import { Request, Response, NextFunction } from "express";
import { auth } from "./auth";
import { fromNodeHeaders } from "better-auth/node";
import type { AuthUser, AuthSession } from "../types/auth.types";

// Extend Express Request to include the authenticated user and session
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      session?: AuthSession;
    }
  }
}

/**
 * Auth middleware — verifies the session cookie/token from the request.
 * If valid, attaches `req.user` and `req.session` for downstream handlers.
 * If invalid, returns 401.
 *
 * Usage in routes:
 *   router.get("/protected", requireAuth, controller.someMethod);
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      res.status(401).json({ error: "Unauthorized — no valid session" });
      return;
    }

    req.user = session.user;
    req.session = session.session as any;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
}
