import { useEffect, useState } from "react";
import { addProgressUpdate, getTasks, updateTask, type Task } from "../../services/taskService";


const TeamMemberDashboard = () => {

  const [tasks, setTasks] = useState<Task[]>([]);

  const [progressMessage, setProgressMessage] = useState("");

  useEffect(() => {

    const fetchTasks = async () => {

      try {
        const taskData = await getTasks();
        setTasks(taskData);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    }
    fetchTasks();
  }, []);

  const handleStatusChange = async (
    taskId: string,
    status: string
  ) => {
    try {
      const updatedTask = await updateTask(taskId, { status });

      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task._id === taskId ? updatedTask : task))
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  }

  const handleAddProgress = async (
    taskId: string
  ) => {
    if (!progressMessage.trim()) {
      return;
    }

    try {
      const updatedTask = await addProgressUpdate(
        taskId,
        progressMessage
      );

      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task._id === taskId ? updatedTask : task
        )
      );

      setProgressMessage("");
    } catch (error) {
      console.error("Failed to add progress update:", error);
    }
  };

  return (
    <div>
      <h2>Team Member Dashboard</h2>
      <p>Welcome Team Member!</p>

      <h3>My Tasks</h3>
      {tasks.length === 0 ? (<p>No tasks assigned to you</p>)
        : (
          <div>
            {tasks.map((task) => (
              <div key={task._id}>
                <h4>{task.title}</h4>
                <p>Description: {task.description}</p>
                <p>Project: {task.project.name}</p>
                <p>Priority: {task.priority}</p>
                <p>Status: {" "}
                  <select value={task.status}
                    onChange={(event) =>
                      handleStatusChange(task._id, event.target.value)
                    }>
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </p>
                <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>

                <h5>Progress Updates</h5>

                {task.progressUpdates.length === 0 ? (
                  <p>No progress updates yet</p>
                ) : (
                  <div>
                    {task.progressUpdates.map((update, index) => (
                      <div key={index}>
                        <p>{update.message}</p>
                        <small>
                          {new Date(update.updatedAt).toLocaleDateString()}
                        </small>
                      </div>
                    ))}
                  </div>
                )}

                <input
                  type="text"
                  value={progressMessage}
                  onChange={(event) => setProgressMessage(event.target.value)}
                  placeholder="Add progress update"
                />

                <button onClick={() => handleAddProgress(task._id)}>
                  Add Update
                </button>
              </div>
            )
            )}
          </div>
        )}
    </div>
  );
};

export default TeamMemberDashboard;