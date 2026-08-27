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
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-gray-800">Task Management</h3>
                <p className="mt-1 text-sm text-gray-500">Create tasks , assign to team members and manage tasks</p>
            </div>


            <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                <h4 className="mb-4 text-lg font-semibold text-gray-800"> Create Task </h4>
                <form onSubmit={handleCreateTask}
                    className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Task Title</label>
                        <input
                            type="text"
                            value={taskTitle}
                            onChange={(event) => setTaskTitle(event.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Project</label>
                        <select
                            value={taskProject}
                            onChange={(event) => setTaskProject(event.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
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
                        <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={taskDescription}
                            onChange={(event) => setTaskDescription(event.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Assigned To</label>
                        <select
                            value={taskAssignedTo}
                            onChange={(event) => setTaskAssignedTo(event.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
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
                        <label className="mb-1 block text-sm font-medium text-gray-700">Priority</label>
                        <select
                            value={taskPriority}
                            onChange={(event) => setTaskPriority(event.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Deadline</label>
                        <input
                            type="datetime-local"
                            value={taskDeadline}
                            onChange={(event) => setTaskDeadline(event.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="flex items-end">
                        <button type="submit"
                            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
                            Create Task
                        </button>
                    </div>

                </form>
                {taskMessage && <p className="mt-4 text-sm font-medium text-green-600">{taskMessage}</p>}
            </div>

            <div>

                <h4 className="mb-4 text-lg font-semibold text-gray-800"> Tasks </h4>
                {tasks.length === 0 ? (<p className="text-gray-500">No tasks found</p>)
                    : (
                        <div className="grid gap-4 md:grid-cols-3">
                            {tasks.map((task) => (
                                <div key={task._id}
                                    className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm" >
                                    <div className="flex items-start justify-between gap-3">
                                        <h5 className="text-lg font-semibold text-gray-800"> {task.title} </h5>
                                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${task.priority === "hard" ? "bg-red-100 text-red-700"
                                            : task.priority === "medium" ? "bg-yellow-100 text-yellow-700"
                                                : "bg-green-100 text-green-700"}`} >
                                            {task.priority}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-600">{task.description}</p>
                                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                                        <p> <span className="font-medium text-gray-800"> Project: </span>{" "} {task.project.name} </p>
                                        <p> <span className="font-medium text-gray-800"> Assigned To: </span>{" "} {task.assignedTo.name} </p>
                                        <p> <span className="font-medium text-gray-800"> Status: </span>{" "} {task.status} </p>
                                        <p> <span className="font-medium text-gray-800"> Deadline: </span>{" "} {new Date(task.deadline).toLocaleDateString()} </p>
                                    </div>

                                    {task.deadlineHistory.length > 0 && (
                                        <div className="mt-5 rounded-lg bg-gray-50 p-4">
                                            <h6 className="mb-3 font-semibold text-gray-800"> Deadline History </h6>

                                            {task.deadlineHistory.map((history, index) => (
                                                <div key={index}
                                                    className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0" >
                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-medium text-gray-800"> Previous: </span>{" "}
                                                        {new Date(history.oldDeadline).toLocaleDateString()}
                                                    </p>

                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-medium text-gray-800"> Updated: </span>{" "}
                                                        {new Date(history.newDeadline).toLocaleDateString()}
                                                    </p>

                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-medium text-gray-800"> Changed By: </span>{" "}
                                                        {history.changedBy.name}
                                                    </p>

                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-medium text-gray-800"> Changed At: </span>{" "}
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
        </div>
    );
};

export default TaskManagement;