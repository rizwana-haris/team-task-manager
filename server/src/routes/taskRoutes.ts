import { Router } from "express";
import { addProgressUpdate, createTask, deleteTask, getTaskById, getTasks, updateTask } from "../controllers/taskController";
import { protect } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";
import { createComment, getTaskComments } from "../controllers/commentController";

const router = Router();

router.post("/",protect,requireRole("admin"),createTask);
router.get("/",protect,getTasks);
router.post("/:id/comments",protect,createComment);
router.get("/:id/comments",protect,getTaskComments);
router.get("/:id",protect,getTaskById);
router.patch("/:id",protect,updateTask);
router.delete("/:id",protect,requireRole("admin"),deleteTask);
router.post("/:id/progress", protect, addProgressUpdate);

export default router;