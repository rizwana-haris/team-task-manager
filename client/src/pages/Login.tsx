import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event: React.SubmitEvent) => {
        event.preventDefault();

        setError("");

        try {
            const response = await api.post("/auth/login", {
                email,
                password,
            });

            console.log(response.data);

            localStorage.setItem("token", response.data.token);

            navigate("/dashboard");

        } catch (error: any) {
            console.error("Login error:", error);
            if (error.response?.status === 401) {
                setError("Invalid email or password.");
            } else {
                setError("Something went wrong. Please try again.");
            }
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800"> TEAM PROJECT MANAGER </h1>
                    <p className="mt-2 text-sm text-gray-500"> Login to your account </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                            placeholder="Enter your email" />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700"> Password </label>
                        <input type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                            placeholder="Enter your password" />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <button type="submit"
                        className="w-full rounded-lg bg-blue-600 py-2.5 font-medium text-white hover:bg-blue-700">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;