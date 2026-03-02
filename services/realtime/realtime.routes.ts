import { Router } from "express";
import { roomManager } from "./roomManager";
import { requireAuth } from "../src/lib/middleware";

const router = Router();

/** GET /api/realtime/stats — active rooms + watcher counts */
router.get("/stats", requireAuth, (req, res) => {
  const stats = roomManager.getStats();
  res.json({
    totalRooms: stats.length,
    totalWatchers: stats.reduce((sum, r) => sum + r.watchers, 0),
    rooms: stats,
  });
});

export default router;
