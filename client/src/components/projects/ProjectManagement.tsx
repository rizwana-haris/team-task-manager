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

    useEffect (()=>{
            const fetchProjects = async() =>{
                try{
                    const projectsData = await getProjects();
                    setProjects(projectsData);

                    for(const project of projectsData){
                        const progress = await getProjectProgress(project._id);

                        setProjectProgress((previousProgress) =>({...previousProgress,[project._id]:progress}))
                    }

                } catch(error){
                    console.error("Failed to fetch projects:", error);
                }
            }
            fetchProjects();
        },[])

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

    return (
        <div>
            <h3>Project Management</h3>

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
                            {projectProgress[project._id] && (
                            <div>
                                <h5>Project Progress</h5>
                                <p>
                                    Total Tasks: {projectProgress[project._id].totalTasks}
                                </p>
                                <p>
                                    To Do: {projectProgress[project._id].todo}
                                </p>
                                <p>
                                    In Progress: {projectProgress[project._id].in_progress}
                                </p>
                                <p>
                                    Completed: {projectProgress[project._id].completed}
                                </p>
                                <p>
                                    Progress: {projectProgress[project._id].percentage}%
                                </p>
                            </div>
                            )}
                        </div>

                    )))}

        </div>
    )
}

export default ProjectManagement;