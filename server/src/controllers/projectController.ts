import { Request, Response } from "express";
import Project from "../models/Project";
import mongoose from "mongoose";
import Task from "../models/Task";

export const createProject = async(req:Request,res:Response) =>{
    try{
        const {name,description,startDate,endDate} = req.body;

        if (!name || !description || !startDate || !endDate) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        const project = await Project.create({
            name,
            description,
            startDate,
            endDate,
            createdBy: req.user.userId,
        })
        return res.status(201).json({
            message:"Project created successfully",
            project
        })

    } catch(error){
        return res.status(500).json({
            message: "Server error",
        });
    }
}


export const getProjects = async(req:Request, res:Response) =>{
    try{
        const projects = await Project.find()
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });

        return res.status(200).json({
            projects,
        });
    } catch(error){
        return res.status(500).json({
            message: "Server error",
        });
    };
} 

export const getProjectById = async(req:Request, res:Response) =>{
    try{

        const { id } = req.params as { id: string };

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid project ID",
            });
        }

        const project = await Project.findById(id)
        .populate("createdBy", "name email");

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        return res.status(200).json({
            project
        });

    } catch(error){
        return res.status(500).json({
            message: "Server error",
        });
    };
} 

export const getProjectProgress = async (req:Request,res:Response) =>{
    try{
        const { id } = req.params as { id: string };

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid project ID",
            });
        }

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

    
        const tasks = await Task.find({project:id});

        const totalTasks = tasks.length;

        const todo = tasks.filter((task) => task.status ==="todo").length;
        const in_progress = tasks.filter((task) => task.status ==="in_progress").length;
        const completed = tasks.filter((task) => task.status ==="completed").length;

        const percentage = totalTasks===0?0:Math.round((completed/totalTasks)*100);


        return res.status(200).json({
            project:{
                id:project._id,
                name:project.name
            },
            progress: {
                totalTasks,
                todo,
                in_progress,
                completed,
                percentage
            }
        });

    } catch (error){
        return res.status(500).json({
            message: "Server error",
        });
    }
}

export const updateProject = async(req:Request, res:Response) =>{
    try{

        const {id}= req.params as{id:string};

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid project ID",
            });
        }

        if(!req.user){
            return res.status(401).json({
                message:"Authentication required"
            })
        }

        const project = await Project.findById(id);

        if(!project){
             return res.status(404).json({
                message:"Project not found"
            })
        }

        const {name,description,startDate,endDate} = req.body;

        if (name !== undefined) {
            project.name = name;
        }
        if (description !== undefined) {
            project.description = description;
        }
        if (startDate !== undefined) {
            project.startDate = startDate;
        }
        if (endDate !== undefined) {
            project.endDate = endDate;
        }
        await project.save();

        return res.status(200).json({
            message:"Project updated successfully",
            project
        })

    } catch(error){
        return res.status(500).json({
            message:"Server error"
        })
    }
}


export const deleteProject = async(req:Request, res:Response) =>{
    try{

        const {id} = req.params as { id: string };

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid project ID"
            });
        }

        const project = await Project.findById(id);
        
        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }  

        await Project.findByIdAndDelete(id);

        return res.status(200).json({
            message:"Project deleted successfully"
        });

    } catch(error){
        return res.status(500).json({
            message: "Server error",
        });
    }
}