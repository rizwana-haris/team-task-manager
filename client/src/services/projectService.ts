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

    return response.data.projects;
}