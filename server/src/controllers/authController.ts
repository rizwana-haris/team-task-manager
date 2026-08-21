import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import generateToken from "../utils/jwt";

export const registerUser = async ( req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      res.status(400).json({
        message: "Name, email and password are required",
      });
      return;
    }

    // Check whether the email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({
        message: "User with this email already exists",
      });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "team_member",
    });

    // Send response without password
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const loginUser = async (req:Request, res:Response) =>{
    try{
        const { email,password } =req.body;

         if  (!email || !password) {
             return res.status(400).json({
             message: "Email and password are required",
         });
        }

        const user = await User.findOne({email}).select("+password");

        if(!user){
           return res.status(401).json({
             message: "Inavlid credentials",
         }); 
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);

        if(!isPasswordValid){
             return res.status(401).json({
             message: "Inavlid credentials",
         });
        }

        const token = generateToken(
            user._id.toString(),
            user.role
        );

        return res.status(200).json({
            message:"Login successful",
            token,
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });

    } catch(error){
        console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error",
    });
    }
}


export const getMe = (req:Request, res:Response) =>{
    return res.status(200).json({
        message: "Authenticated",
        user: req.user,
    });        
}

export const admin = (req:Request, res:Response) =>{
    return res.status(200).json({
        message: "You have access to this route",
    });        
}

