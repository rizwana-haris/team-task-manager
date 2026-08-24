import ProjectManagement from "../projects/ProjectManagement";
import TaskManagement from "../tasks/TaskManagement";
import TeamMemberManagement from "../teamMembers/TeamMemberManagement";

const AdminDashboard = () => {
    
  return (
    <div>
      <h2>Admin Dashboard</h2>

      <p>Welcome Admin</p>
      
      <TeamMemberManagement/>
      <TaskManagement />
      <ProjectManagement />
      
    </div>
  );
};

export default AdminDashboard;