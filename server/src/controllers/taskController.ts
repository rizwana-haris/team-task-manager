import { Request, Response } from "express";
import mongoose from "mongoose";
import Task from "../models/Task";
import Project from "../models/Project";
import User from "../models/User";

export const createTask = async( req:Request,res:Response) =>{
    try{

        const { title,description,project,assignedTo,priority,deadline}= req.body;

        if ( !title || !description || !project || !assignedTo || !deadline) {
            return res.status(400).json({
                message: "Required task fields are missing"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(project)) {
            return res.status(400).json({
                message: "Invalid project ID"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const existingProject = await Project.findById(project);

        if (!existingProject) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        const assignedUser = await User.findById(assignedTo);

        if (!assignedUser) {
            return res.status(404).json({
                message: "Assigned user not found"
            });
        }

        if (assignedUser.role !== "team_member") {
            return res.status(400).json({
                message: "Tasks can only be assigned to team members",
            });
        }

        const task = await Task.create({ title,description, project,assignedTo,priority,deadline });
        return res.status(201).json({
            message:"Task created successfully",
            task
        });

    } catch(error){
        return res.status(500).json({
            message: "Server error",
        });
    }
}


export const getTasks = async( req:Request,res:Response) =>{
    try{
        if(!req.user){
            return res.status(401).json({
                message:"Authentication required"
            })
        }

        let tasks;
        if(req.user.role ==="admin"){
            tasks= await Task.find()
            .populate("project","name")
            .populate("assignedTo","name email")
            .sort({ cretaedAt: -1});
        } else{
             tasks = await Task.find({assignedTo:req.user.userId })
            .populate("project","name")
            .populate("assignedTo","name email")
            .sort({ cretaedAt: -1}); 
        }
        return res.status(200).json({
            tasks
        })

    } catch(error){
        return res.status(500).json({
            message: "Server error",
        });
    }
}


export const getTaskById = async(req:Request, res:Response) =>{
    try{

        const {id} = req.params as { id: string };

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid task ID"
            });
        }

        const task = await Task.findById(id)
        .populate("project", "name description")
        .populate("assignedTo", "name email");

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }  

        if (
            req.user?.role === "team_member" &&
            task.assignedTo._id.toString() !== req.user.userId
        ) {
            return res.status(403).json({
                message: "You are not allowed to view this task",
            });
        }

        return res.status(200).json({
            task,
        });

    } catch(error){
        return res.status(500).json({
            message: "Server error",
        });
    }
}


export const updateTask = async(req:Request, res:Response) =>{
    try{

        const {id} =req.params as {id:string};

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid task ID"
            });
        }

        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }
        
        const task = await Task.findById(id);
        if(!task){
            return res.status(404).json({
                message:"Task not found"
            })
        }

        if(req.user.role==="team_member" && 
           task.assignedTo.toString() !==req.user.userId){
            return res.status(403).json({
                 message:"You are not allowed to update this task"
            })
        }

        const{title,description,status,priority,deadline} = req.body;

        if (title !== undefined) {
            task.title = title;
        }
        if (description !== undefined) {
            task.description = description;
        }
        if (status !== undefined) {
            task.status = status;
        }
        if (priority !== undefined) {
            task.priority = priority;
        }
        if (req.user.role==="team_member" && deadline!== undefined){
            return res.status(403).json({
                message: "Only admins can change task deadlines",
            });
        }
        if (deadline !== undefined && 
            new Date(deadline).getTime() !== task.deadline.getTime()){
                task.deadlineHistory.push({
                   oldDeadline: task.deadline, 
                   newDeadline: new Date(deadline),
                   changedBy: new mongoose.Types.ObjectId(req.user.userId),
                   changedAt: new Date(),
                })
            task.deadline = new Date(deadline);
        }
        await task.save();
        return res.status(200).json({
            message: "Task updated successfully",
            task,
        });
        
    } catch(error){

    }
}


export const deleteTask = async(req:Request, res:Response) =>{
    try{

        const {id} = req.params as { id: string };

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid task ID"
            });
        }

        const task = await Task.findById(id);
        
        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }  

        await Task.findByIdAndDelete(id);

        return res.status(200).json({
            message:"Task deleted successfully"
        });

    } catch(error){
        return res.status(500).json({
            message: "Server error",
        });
    }
}
