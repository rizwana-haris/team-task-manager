import { useEffect, useState } from "react";
import api from "../services/api";
import TeamMemberDashboard from "../components/dashboard/TeamMemberDashboard";
import AdminDashboard from "../components/dashboard/AdminDashboard";
import { useNavigate } from "react-router-dom";

interface User {
    userId: string;
    role: "admin" | "team_member";
}

const Dashboard = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/auth/me");
                const loggedInUser = response.data.user;

                setUser(loggedInUser);

            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            }
        }
        fetchData();

    }, []);

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    }

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Header */}
            <header className="bg-white border-b">
                <div className="flex items-center justify-between px-6 py-4">
                    <h1 className="text-2xl font-bold text-gray-800">
                        TEAM PROJECT MANAGER
                    </h1>

                    <button
                        onClick={handleLogout}
                        className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600">
                        Logout
                    </button>
                </div>
            </header>

            {/* Main */}
            <main className="p-6">

                {user.role === "admin" && <AdminDashboard />}

                {user.role === "team_member" && <TeamMemberDashboard />}

            </main>
        </div>
    );
}

export default Dashboard;