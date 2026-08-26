import { useEffect, useState } from "react";
import { createTask, getTasks, type Task } from "../../services/taskService";
import { getProjects, type Project } from "../../services/projectService";
import { getTeamMembers, type TeamMember } from "../../services/userService";


const TaskManagement = () => {
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskProject, setTaskProject] = useState("");
    const [taskAssignedTo, setTaskAssignedTo] = useState("");
    const [taskPriority, setTaskPriority] = useState("medium");
    const [taskDeadline, setTaskDeadline] = useState("");
    const [taskMessage, setTaskMessage] = useState("");

    const [tasks, setTasks] = useState<Task[]>([]);

    const [projects, setProjects] = useState<Project[]>([]);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

    useEffect(() => {
        const fetchTasks = async () => {

            try {
                const tasksData = await getTasks();
                setTasks(tasksData);

                const projectsData = await getProjects();
                setProjects(projectsData);

                const membersData = await getTeamMembers();
                setTeamMembers(membersData);
            } catch (error) {
                console.error("Failed to fetch tasks:", error);
            }
        }
        fetchTasks();
    }, []);

    const handleCreateTask = async (event: React.SubmitEvent) => {
        event.preventDefault();
        setTaskMessage("");

        try {
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

        } catch (error) {
            setTaskMessage("Failed to create task");
        }
    }

    return (
        <div>
            <h3>Task Management</h3>
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
            {tasks.length === 0 ? (<p>No tasks found</p>)
                : (
                    <div>
                        {tasks.map((task) => (
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

                                {task.deadlineHistory.length > 0 && (
                                    <div>
                                        <h5>Deadline History</h5>

                                        {task.deadlineHistory.map((history, index) => (
                                            <div key={index}>
                                                <p>
                                                    Previous:{" "}
                                                    {new Date(history.oldDeadline).toLocaleDateString()}
                                                </p>

                                                <p>
                                                    Updated:{" "}
                                                    {new Date(history.newDeadline).toLocaleDateString()}
                                                </p>

                                                <p>
                                                    Changed By: {history.changedBy.name}
                                                </p>

                                                <p>
                                                    Changed At:{" "}
                                                    {new Date(history.changedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                )}
        </div>
    );
};

export default TaskManagement;