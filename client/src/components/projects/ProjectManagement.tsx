import { useEffect, useState } from "react";
import { createProject, getProjectProgress, getProjects, type Project, type ProjectProgress } from "../../services/projectService";

const ProjectManagement = () => {

    const [projects, setProjects] = useState<Project[]>([])

    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [projectStartDate, setProjectStartDate] = useState("");
    const [projectEndDate, setProjectEndDate] = useState("");
    const [projectMessage, setProjectMessage] = useState("");

    const [projectProgress, setProjectProgress] = useState<
        Record<string, ProjectProgress>
    >({});

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const projectsData = await getProjects();
                setProjects(projectsData);

                for (const project of projectsData) {
                    const progress = await getProjectProgress(project._id);

                    setProjectProgress((previousProgress) => ({ ...previousProgress, [project._id]: progress }))
                }

            } catch (error) {
                console.error("Failed to fetch projects:", error);
            }
        }
        fetchProjects();
    }, [])

    const handleCreateProject = async (event: React.SubmitEvent) => {
        event.preventDefault();
        setProjectMessage("");

        try {
            await createProject({
                name: projectName,
                description: projectDescription,
                startDate: projectStartDate,
                endDate: projectEndDate
            });

            setProjectMessage("Project created successfully");

            setProjectName("");
            setProjectDescription("");
            setProjectStartDate("");
            setProjectEndDate("");

            const data = await getProjects();
            setProjects(data);

            for (const project of data) {
            const progress = await getProjectProgress(project._id);

            setProjectProgress((previousProgress) => ({
                ...previousProgress,
                [project._id]: progress,
            }));
        }
        
        } catch (error) {
            setProjectMessage("Failed to create project");
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-gray-800">Project Management</h3>
                <p className="mt-1 text-sm text-gray-500"> Create projects and monitor their progress. </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                <h4 className="mb-4 text-lg font-semibold text-gray-800"> Create Project </h4>
                <form onSubmit={handleCreateProject}
                    className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700"> Project Name </label>
                        <input
                            type="text"
                            value={projectName}
                            onChange={(event) => setProjectName(event.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Start Date</label>
                        <input
                            type="date"
                            value={projectStartDate}
                            onChange={(event) => setProjectStartDate(event.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={projectDescription}
                            onChange={(event) => setProjectDescription(event.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">End Date</label>
                        <input
                            type="date"
                            value={projectEndDate}
                            onChange={(event) => setProjectEndDate(event.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="flex items-end">
                        <button type="submit" className=" rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700" > Create Project </button>
                    </div>
                </form>
                {projectMessage && (<p className="mt-4 text-sm font-medium text-green-600"> {projectMessage} </p>)}
            </div>

            <div>
            <h4 className="mb-4 text-lg font-semibold text-gray-800"> Projects </h4>

            {projects.length === 0 ? (<p className="text-gray-500">No projects found</p>)
                : (
                    <div className="grid gap-4 md:grid-cols-3">

                    {projects.map((project) => (
                    <div key={project._id}
                        className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                        <h5 className="text-lg font-semibold text-gray-800"> {project.name} </h5>
                        <p className="mt-2 text-sm text-gray-600"> {project.description} </p>
                        <div className="mt-4 space-y-2 text-sm text-gray-600">
                            <p>
                                <span className="font-medium text-gray-800"> Start Date: </span>{" "}
                                {new Date(project.startDate).toLocaleDateString()}
                            </p>
                            <p>
                                <span className="font-medium text-gray-800"> End Date: </span>{" "}
                                {new Date(project.endDate).toLocaleDateString()} </p>
                            <p>
                                <span className="font-medium text-gray-800"> Created By: </span>{" "}
                                {project.createdBy.name}
                            </p>
                        </div>

                        {projectProgress[project._id] && (
                            <div className="mt-5 rounded-lg bg-gray-50 p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <h6 className="font-semibold text-gray-800"> Project Progress </h6>
                                    <span className="font-semibold text-blue-600"> {projectProgress[project._id].percentage}% </span>
                                </div>


                                <div className="grid grid-cols-4 gap-3 text-sm">
                                    <div>
                                        <p className="text-gray-500">Total Tasks</p>
                                        <p className="font-semibold text-gray-800">
                                            {projectProgress[project._id].totalTasks}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">To Do</p>
                                        <p className="font-semibold text-gray-800">
                                            {projectProgress[project._id].todo}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">In Progress</p>
                                        <p className="font-semibold text-gray-800">
                                            {projectProgress[project._id].in_progress}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Completed</p>
                                        <p className="font-semibold text-gray-800">
                                            {projectProgress[project._id].completed}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                ))}
                </div>
                )}
            </div>
        </div>
    )
}

export default ProjectManagement;