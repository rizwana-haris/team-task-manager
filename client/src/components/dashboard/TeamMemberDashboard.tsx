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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800"> Team Member Dashboard </h2>
        <p className="mt-1 text-gray-500"> Welcome! Here are your assigned tasks. </p>
      </div>

      <h3 className="mb-4 text-xl font-semibold text-gray-800"> My Tasks </h3>
      {tasks.length === 0 ? (<p className="text-gray-500">No tasks assigned to you</p>)
        : (
          <div className="grid gap-5 md:grid-cols-2">
            {tasks.map((task) => (
              <div key={task._id}
                className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">

                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-lg font-semibold text-gray-800"> {task.title} </h4>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${task.priority === "high" ? "bg-red-100 text-red-700"
                    : task.priority === "medium" ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"}`} >
                    {task.priority}
                  </span>
                </div>

                <p className="mt-3 text-sm text-gray-600">{task.description}</p>

                <div className="mt-4 space-y-2 text-sm">
                  <p>
                    <span className="font-medium text-gray-800"> Project: </span>{" "}
                    {task.project.name}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800"> Deadline: </span>{" "}
                    {new Date(task.deadline).toLocaleDateString()}
                  </p>
                </div>

                <div className="mt-4">
                  <label className="mb-1 block text-sm font-medium text-gray-700"> Status </label>
                  <select
                    value={task.status}
                    onChange={(event) => handleStatusChange(task._id, event.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500">
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <h5 className="font-semibold text-gray-800"> Progress Updates </h5>

                {task.progressUpdates.length === 0 ? (
                  <p className="mt-2 text-sm text-gray-500">No progress updates yet</p>
                ) : (
                  <div className="mt-3 space-y-3">
                    {task.progressUpdates.map((update, index) => (
                      <div key={index}
                        className="rounded-lg bg-gray-50 p-3">
                        <p className="text-sm text-gray-700">{update.message}</p>
                        <small className="text-gray-400">
                          {new Date(update.updatedAt).toLocaleDateString()}
                        </small>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={progressMessage}
                  onChange={(event) => setProgressMessage(event.target.value)}
                  placeholder="Add progress update"
                  className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />

                <button onClick={() => handleAddProgress(task._id)}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Add 
                </button>
              </div>
              </div>
            )
            )}
          </div>
        )}
    </div>
  );
};

export default TeamMemberDashboard;