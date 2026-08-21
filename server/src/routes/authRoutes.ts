import { Router } from "express";
import { admin, getMe, loginUser, registerUser } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.get("/admin", protect,requireRole("admin"),admin);

export default router;
