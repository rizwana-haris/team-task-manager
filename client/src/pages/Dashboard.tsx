import { useEffect, useState } from "react";
import api from "../services/api";
import { getProjects,createProject, type Project } from "../services/projectService";
import { createTeamMember, getTeamMembers, type TeamMember } from "../services/userService";

interface User {
    userId:string;
    role:"admin" | "team_member";
}

const Dashboard = () =>{
    const[user,setUser] = useState<User|null>(null);
    const[message,setMessage] = useState("");

    const [projects,setProjects] = useState<Project[]>([])

    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [projectStartDate, setProjectStartDate] = useState("");
    const [projectEndDate, setProjectEndDate] = useState("");
    const [projectMessage, setProjectMessage] = useState("");

    const [memberName, setMemberName] = useState("");
    const [memberEmail, setMemberEmail] = useState("");
    const [memberPassword, setMemberPassword] = useState("");
    const [memberMessage, setMemberMessage] = useState("");

    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

    const handleCreateProject = async (event:React.SubmitEvent) =>{
        
        event.preventDefault();
        setProjectMessage("");

        try{
            await createProject({name:projectName,
                description:projectDescription,
                startDate:projectStartDate,
                endDate:projectEndDate
            });

            setProjectMessage("Project created successfully");

            setProjectName("");
            setProjectDescription("");
            setProjectStartDate("");
            setProjectEndDate("");

            const data = await getProjects();
            setProjects(data);

        } catch(error){
            setProjectMessage("Failed to create project");
        }
    }

    const handleCreateTeamMember = async (event:React.SubmitEvent) =>{
        
        event.preventDefault();
        setMemberMessage("");

        try{
            await createTeamMember({
                name: memberName,
                email: memberEmail,
                password: memberPassword,
            });
            setMemberMessage("Team member created successfully");

            setMemberName("");
            setMemberEmail("");
            setMemberPassword("");


        } catch(error){
            setMemberMessage("Failed to create team member");
        }
    }

    useEffect(() =>{
        const fetchData = async () =>{
            try{
                const response = await api.get("/auth/me");
                const loggedInUser = response.data.user;

                setUser(loggedInUser);
                setMessage(response.data.message);

                const projectsData = await getProjects();
                setProjects(projectsData);

                if (loggedInUser.role === "admin") {
                    const members = await getTeamMembers();
                    setTeamMembers(members);
                }
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

            {user.role==="admin" && (
                <div>
                    <h2>Admin Dashboard</h2>

                    <h3>Add Team Member</h3>
                    <form onSubmit={handleCreateTeamMember}>
                        <div>
                            <label>Name</label>
                            <input
                                type="text"
                                value={memberName}
                                onChange={(event) => setMemberName(event.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Email</label>
                            <input
                                type="email"
                                value={memberEmail}
                                onChange={(event) => setMemberEmail(event.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Password</label>
                            <input
                                type="password"
                                value={memberPassword}
                                onChange={(event) => setMemberPassword(event.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <button type="submit">Add Team Member</button>
                    </form>
                    {memberMessage && <p>{memberMessage}</p>}

                    <h3>Team Members</h3>
                    { teamMembers.length===0?(<p>No team members found</p>)
                    : 
                    (
                        <div>
                            {teamMembers.map((member) =>(
                                <div key={member._id}>
                                    <p>Name: {member.name}</p>
                                    <p>Email: {member.email}</p>
                                    <p>Role: {member.role}</p>
                                </div>
                            ))}
                        </div>
                    )}


                    <h3>Create Project</h3>
                    <form onSubmit={handleCreateProject}>
                        <div>
                            <label>Project Name</label>
                            <input
                                type="text"
                                value={projectName}
                                onChange={(event) => setProjectName(event.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Description</label>
                            <textarea
                                value={projectDescription}
                                onChange={(event) => setProjectDescription(event.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Start Date</label>
                            <input
                                type="date"
                                value={projectStartDate}
                                onChange={(event) => setProjectStartDate(event.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>End Date</label>
                            <input
                                type="date"
                                value={projectEndDate}
                                onChange={(event) => setProjectEndDate(event.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">Create Project</button>
                    </form>
                    {projectMessage && <p>{projectMessage}</p>}

                    <h3>Projects</h3>

                    {projects.length===0?(<p>No projects found</p>)
                    : (projects.map((project) =>(
                        <div key={project._id}>
                            <h4>{project.name}</h4>
                            <p>{project.description}</p>
                            <p>
                                Start Date:{" "}
                                {new Date(project.startDate).toLocaleDateString()}
                            </p>
                            <p>
                                End Date:{" "}
                                {new Date(project.endDate).toLocaleDateString()}
                            </p>
                            <p>Created By :{project.createdBy.name}</p>
                        </div>

                    )))}
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