import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app=express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/",(req,res) =>{
    res.json({message:"Team Task Manager API is running"});
})

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();