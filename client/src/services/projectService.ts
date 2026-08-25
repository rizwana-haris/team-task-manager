import api from "./api";

export interface Project {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProjectProgress {
  totalTasks: number;
  todo: number;
  in_progress: number;
  completed: number;
  percentage: number;
}

export const getProjects = async (): Promise<Project[]> =>{
    const response = await api.get("/projects");

    return response.data.projects;
}

export interface CreateProjectData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

export const createProject = async (projectData:CreateProjectData): Promise<Project> =>{
    const response = await api.post("/projects",projectData);

    return response.data.project;
}

export const getProjectProgress = async (projectId : string) :Promise<ProjectProgress> =>{
    const response = await api.get(`/projects/${projectId}/progress`);
    return response.data.progress;
}