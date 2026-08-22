import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";
import { createProject, getProjectById, getProjects } from "../controllers/projectController";

const router = Router();

router.post("/",protect,requireRole("admin"),createProject);
router.get("/",protect,getProjects);
router.get("/:id",protect,getProjectById)

export default router;