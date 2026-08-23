import { useEffect, useState } from "react";
import api from "../services/api";
import { getProjects,createProject, type Project } from "../services/projectService";
import { createTeamMember, getTeamMembers, type TeamMember } from "../services/userService";
import { createTask, getTasks, type Task } from "../services/taskService";

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

    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskProject, setTaskProject] = useState("");
    const [taskAssignedTo, setTaskAssignedTo] = useState("");
    const [taskPriority, setTaskPriority] = useState("medium");
    const [taskDeadline, setTaskDeadline] = useState("");
    const [taskMessage, setTaskMessage] = useState("");

    const [tasks, setTasks] = useState<Task[]>([]);
    
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

    const handleCreateTask = async (event:React.SubmitEvent) =>{
        event.preventDefault();
        setTaskMessage("");

        try{
            const createdTask = await createTask({
                title: taskTitle,
                description: taskDescription,
                project: taskProject,
                assignedTo: taskAssignedTo,
                priority: taskPriority,
                deadline: taskDeadline,
            });
            
            setTasks((previousTasks) => [createdTask, ...previousTasks]);
            setTaskMessage("Task created successfully");

            setTaskTitle("");
            setTaskDescription("");
            setTaskProject("");
            setTaskAssignedTo("");
            setTaskPriority("medium");
            setTaskDeadline("");

        } catch(error){
            setTaskMessage("Failed to create task");
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

                const tasksData = await getTasks();
                setTasks(tasksData);
                
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


                    <h3>Create Task</h3>
                    <form onSubmit={handleCreateTask}>
                        <div>
                            <label>Task Title</label>
                            <input
                                type="text"
                                value={taskTitle}
                                onChange={(event) => setTaskTitle(event.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Description</label>
                            <textarea
                                value={taskDescription}
                                onChange={(event) => setTaskDescription(event.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Project</label>
                            <select
                                value={taskProject}
                                onChange={(event) => setTaskProject(event.target.value)}
                                required
                            >
                               <option value="">Select a project</option>
                                {projects.map((project) => (
                                    <option key={project._id} value={project._id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Assigned To</label>
                            <select
                                value={taskAssignedTo}
                                onChange={(event) => setTaskAssignedTo(event.target.value)}
                                required
                            >
                                <option value="">Select a team member</option>
                                {teamMembers.map((member) => (
                                        <option key={member._id} value={member._id}>
                                        {member.name}
                                </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Priority</label>
                            <select 
                                 value={taskPriority}
                                 onChange={(event) => setTaskPriority(event.target.value)}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div>
                            <label>Deadline</label>
                            <input
                                type="datetime-local"
                                value={taskDeadline}
                                onChange={(event) => setTaskDeadline(event.target.value)}
                                required
                            />
                        </div>      
                        <button type="submit">Create Task</button>

                    </form>
                    {taskMessage && <p>{taskMessage}</p>}

                    <h3>Tasks</h3>
                    { tasks.length===0?(<p>No tasks found</p>)
                    :(
                        <div>
                            {tasks.map((task) =>(
                                <div key={task._id}>
                                    <h4>{task.title}</h4>
                                    <p>Description: {task.description}</p>
                                    <p>Project: {task.project.name}</p>
                                    <p>Assigned To: {task.assignedTo.name}</p>
                                    <p>Status: {task.status}</p>
                                    <p>Priority: {task.priority}</p>
                                    <p>
                                        Deadline:{" "}
                                        {new Date(task.deadline).toLocaleDateString()}
                                    </p>
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