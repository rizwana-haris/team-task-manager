import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";
import { createProject, deleteProject, getProjectById, getProjectProgress, getProjects, updateProject } from "../controllers/projectController";

const router = Router();

router.post("/",protect,requireRole("admin"),createProject);
router.get("/",protect,getProjects);
router.get("/:id/progress",protect,requireRole("admin"),getProjectProgress)
router.get("/:id",protect,getProjectById);
router.patch("/:id",protect,requireRole("admin"),updateProject);
router.delete("/:id",protect,requireRole("admin"),deleteProject);


export default router;