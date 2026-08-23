import api from "./api";

export interface Task {
  _id: string;
  title: string;
  description: string;
  project: {
    _id: string;
    name: string;
  };
  assignedTo: {
    _id: string;
    name: string;
    email: string;
  };
  status: string;
  priority: string;
  deadline: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  project: string;
  assignedTo: string;
  priority: string;
  deadline: string;
}

export const createTask = async (
  taskData: CreateTaskData
): Promise<Task> => {
  const response = await api.post("/tasks", taskData);

  return response.data.task;
};