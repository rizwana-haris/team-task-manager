import { useEffect, useState } from "react";
import api from "../services/api";
import TeamMemberDashboard from "../components/dashboard/TeamMemberDashboard";
import AdminDashboard from "../components/dashboard/AdminDashboard";

interface User {
    userId:string;
    role:"admin" | "team_member";
}

const Dashboard = () =>{
    const[user,setUser] = useState<User|null>(null);
    const[message,setMessage] = useState("");

    useEffect(() =>{
        const fetchData = async () =>{
            try{
                const response = await api.get("/auth/me");
                const loggedInUser = response.data.user;

                setUser(loggedInUser);
                setMessage(response.data.message);
              
            } catch(error){
                console.error("Failed to fetch dashboard data:", error);
            }
        }
        fetchData();

    },[]);

    if (!user) {
        return <p>Loading...</p>;
    }

    return(
        <div>
            <h1>Dashboard</h1>

            <p>{message}</p>

            {user.role === "admin" && <AdminDashboard />}

            {user.role === "team_member" && <TeamMemberDashboard/>}
        </div>
    )
}

export default Dashboard;