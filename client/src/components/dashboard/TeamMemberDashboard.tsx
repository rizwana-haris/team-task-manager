import { useEffect, useState } from "react";
import { getTasks, updateTask, type Task } from "../../services/taskService";


const TeamMemberDashboard = () => {

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(()=>{

    const fetchTasks = async() =>{

      const taskData = await getTasks();
      setTasks(taskData);
      try{

      } catch(error){
        console.error("Failed to fetch tasks:", error);
      }
    }
    fetchTasks();
  },[]);

  const handleStatusChange = async(
    taskId:string,
    status:string
  ) =>{
    try{
      const updatedTask = await updateTask(taskId,{status});

      setTasks((previousTasks) =>
        previousTasks.map((task) =>
        task._id ===taskId ? updatedTask : task))
    } catch(error){
      console.error("Failed to update task status:", error);
    }
  }

  return (
    <div>
      <h2>Team Member Dashboard</h2>
      <p>Welcome Team Member!</p>

      <h3>My Tasks</h3>
      {tasks.length === 0 ?(<p>No tasks assigned to you</p>)
      :(
        <div>
          { tasks.map((task) =>(
            <div key ={task._id}>
              <h4>{task.title}</h4>
              <p>Description: {task.description}</p>
              <p>Project: {task.project.name}</p>
              <p>Priority: {task.priority}</p>
              <p>Status: {" "}
                <select value ={task.status}
                        onChange={(event) =>
                          handleStatusChange(task._id, event.target.value)
                        }>
                        <option value="todo">To Do</option>  
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                </select>
              </p>
              <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
            </div>
          )
          )}
        </div>
      )}
    </div>
  );
};

export default TeamMemberDashboard;