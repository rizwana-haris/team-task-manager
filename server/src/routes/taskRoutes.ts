import { Router } from "express";
import { createTask, deleteTask, getTaskById, getTasks, updateTask } from "../controllers/taskController";
import { protect } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";

const router = Router();

router.post("/",protect,requireRole("admin"),createTask);
router.get("/",protect,getTasks);
router.get("/:id",protect,getTaskById);
router.patch("/:id",protect,updateTask);
router.delete("/:id",protect,requireRole("admin"),deleteTask);

export default router;