import { Request, Response } from "express";
import Project from "../models/Project";

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

        const {id} = req.params;

        const project = await Project.findById(id)
        .populate("createdBy", "name email");

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }
    
        return res.status(200).json({
            project,
        });
        
    } catch(error){
        return res.status(500).json({
            message: "Server error",
        });
    };
} 