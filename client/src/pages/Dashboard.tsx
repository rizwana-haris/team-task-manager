import { useEffect, useState } from "react";
import api from "../services/api";

interface User {
    userId:string;
    role:"admin" | "team_member";
}

const Dashboard = () =>{
    const[user,setUser] = useState<User|null>(null);
    const[message,setMessage] = useState("");

    useEffect(() =>{
        const fetchUser = async () =>{
            try{
                const response = await api.get("/auth/me");
                setUser(response.data.user);
                setMessage(response.data.message);
            } catch(error){
                console.error("Failed to fetch user:", error);
            }
        }
        fetchUser();
    },[]);

    return(
        <div>
            <h1>Dashboard</h1>

            <p>{message}</p>

            {user && (
                <div>
                    <p>UserID:{user.userId}</p>
                    <p>Role:{user.role}</p>
                </div>
            )}
        </div>
    )
}

export default Dashboard;