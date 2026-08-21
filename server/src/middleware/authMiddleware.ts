import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  role: string;
}

export const protect = (req:Request, res:Response, next:NextFunction) =>{
    try{

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
        throw new Error("JWT_SECRET is not defined");
        }

        const decoded = jwt.verify(token,secret) as JwtPayload;

         req.user = decoded;
         next();

    } catch(error){
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
}