import { Request, Response } from "express";
import mongoose from "mongoose";
import Task from "../models/Task";
import Comment from "../models/Comment";

export const createComment = async (req:Request, res:Response) =>{
    try{

        const { id } = req.params as { id: string };
        const { message } = req.body || {};

        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid task ID",
            });
        }

        if (!message || !message.trim()) {
            return res.status(400).json({
                message: "Comment message is required",
            });
        }

        const task = await Task.findById(id);

        if (task === null) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        if ( req.user.role === "team_member" &&
            task.assignedTo.toString() !== req.user.userId) {
                return res.status(403).json({
                    message: "You are not allowed to comment on this task",
                });
        }

        const comment = await Comment.create({
            task: id,
            user: req.user.userId,
            message: message.trim(),
        });

        return res.status(201).json({
            message: "Comment added successfully",
            comment,
         });

    } catch(error){
        return res.status(500).json({
            message: "Server error",
        });
    }
}


export const getTaskComments = async(req:Request, res:Response) =>{
    try{

        const { id } = req.params as { id: string };

        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid task ID",
            });
        }

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        if ( req.user.role === "team_member" &&
            task.assignedTo.toString() !== req.user.userId ) {
                return res.status(403).json({
                    message: "You are not allowed to view comments for this task",
                });
        }

        const comments = await Comment.find({ task: id })
            .populate("user", "name email")
            .sort({ createdAt: 1 });

        return res.status(200).json({
            comments,
        });   

    } catch(error){
        return res.status(500).json({
            message: "Server error",
        });
    }
}