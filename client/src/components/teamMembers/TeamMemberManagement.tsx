import { useEffect, useState } from "react";
import { createTeamMember, getTeamMembers, type TeamMember } from "../../services/userService";

const TeamMemberManagement = () => {

    const [memberName, setMemberName] = useState("");
    const [memberEmail, setMemberEmail] = useState("");
    const [memberPassword, setMemberPassword] = useState("");
    const [memberMessage, setMemberMessage] = useState("");

    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

    useEffect(() => {
        const fetchTeamMembers = async () => {

            try {
                const membersData = await getTeamMembers();
                setTeamMembers(membersData);

            } catch (error) {
                console.error("Failed to fetch team members:", error);
            }
        }
        fetchTeamMembers();
    }, []);

    const handleCreateTeamMember = async (event: React.SubmitEvent) => {
        event.preventDefault();
        setMemberMessage("");

        try {
            await createTeamMember({
                name: memberName,
                email: memberEmail,
                password: memberPassword,
            });
            setMemberMessage("Team member created successfully");

            setMemberName("");
            setMemberEmail("");
            setMemberPassword("");

            const members = await getTeamMembers();
            setTeamMembers(members);

        } catch (error) {
            setMemberMessage("Failed to create team member");
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-gray-800">Team Member Management</h3>
                <p className="mt-1 text-sm text-gray-500">Add and manage Team Members</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                <form onSubmit={handleCreateTeamMember}
                    className="grid gap-4 md:grid-cols-3">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            value={memberName}
                            onChange={(event) => setMemberName(event.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={memberEmail}
                            onChange={(event) => setMemberEmail(event.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={memberPassword}
                            onChange={(event) => setMemberPassword(event.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                            minLength={6}
                        />
                    </div>
                    <div className="flex items-end">
                        <button type="submit"
                            className=" rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700" >
                            Add Team Member
                        </button>
                    </div>
                </form>
                {memberMessage && <p className="mt-4 text-sm font-medium text-green-600">{memberMessage}</p>}
            </div>


            <h4 className="mb-4 text-lg font-semibold text-gray-800"> Team Members </h4>
            {teamMembers.length === 0 ? (<p className="text-gray-500">No team members found</p>)
                :
                (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {teamMembers.map((member) => (
                            <div key={member._id}
                                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                <h5 className="font-semibold text-gray-800"> {member.name} </h5>
                                <p className="mt-1 text-sm text-gray-600"> {member.email} </p>
                                <span className="mt-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"> {member.role} </span>
                            </div>
                        ))}
                    </div>
                )}
        </div>
    );
};

export default TeamMemberManagement;