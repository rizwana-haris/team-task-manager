import ProjectManagement from "../projects/ProjectManagement";
import TaskManagement from "../tasks/TaskManagement";
import TeamMemberManagement from "../teamMembers/TeamMemberManagement";

const AdminDashboard = () => {

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800">ADMIN DASHBOARD</h2>

        <p className="mt-1 text-gray-600">Welcome Admin. Manage your projects, tasks and team members.</p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm"><TeamMemberManagement /></div>

      <div className="rounded-xl bg-white p-6 shadow-sm"><TaskManagement /></div>

      <div className="rounded-xl bg-white p-6 shadow-sm"><ProjectManagement /></div>

    </div>
  );
};

export default AdminDashboard;