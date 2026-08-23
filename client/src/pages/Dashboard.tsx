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

    if (!user) {
        return <p>Loading...</p>;
    }

    return(
        <div>
            <h1>Dashboard</h1>

            <p>{message}</p>

            {user.role==="admin" && (
                <div>
                    <h2>Admin Dashboard</h2>
                    <p>Welcome Admin</p>
                </div>
            )}
            {user.role === "team_member" && (
                <div>
                    <h2>Team Member Dashboard</h2>
                    <p>Welcome Team Member!</p>
                </div>
            )}
        </div>
    )
}

export default Dashboard;