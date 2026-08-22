import { Router } from "express";
import { createTeamMember } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";

const router = Router();

router.post("/", protect, requireRole("admin"),createTeamMember );

export default router;