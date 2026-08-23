import { Router } from "express";
import { createTeamMember, getTeamMembers } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";

const router = Router();

router.post("/", protect, requireRole("admin"),createTeamMember );
router.get("/team-members",protect, requireRole("admin"),getTeamMembers)
export default router;