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
  
  deadlineHistory: {
  oldDeadline: string;
  newDeadline: string;
  changedBy: {
    _id: string;
    name: string;
    email: string;
  };
  changedAt: string;
}[];

  progressUpdates: {
  message: string;
  updatedBy: {
    _id: string;
    name: string;
    email: string;
  };
  updatedAt: string;
}[];
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

export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get("/tasks");

  return response.data.tasks;
};

export const updateTask = async (
  taskId: string,
  taskData: { status: string }
): Promise<Task> => {
  const response = await api.patch(`/tasks/${taskId}`, taskData);

  return response.data.task as Task;
};

export const addProgressUpdate = async (
  taskId: string,
  message: string
): Promise<Task> => {
  const response = await api.post(`/tasks/${taskId}/progress`, {
    message,
  });

  return response.data.task as Task;
};