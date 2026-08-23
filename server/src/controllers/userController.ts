import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";

export const createTeamMember = async (req:Request, res:Response) =>{
    try{

        const {name,email,password} =req.body;
        if (!name || !email || !password){
            return res.status(400).json({
                message:"Name , email and password are required"
            })
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                message: "User with this email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            role:"team_member"
        });
        return res.status(201).json({
            message: "Team member created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
         });

    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        })
    }
}

export const getTeamMembers = async (req:Request, res:Response) =>{
    try{

        const users = await User.find(
            {role:"team_member"},
            "name email"
        )
        return res.status(200).json({users});

    } catch(error){
        return res.status(500).json({
            message: "Server error"
        })
    }
}
    