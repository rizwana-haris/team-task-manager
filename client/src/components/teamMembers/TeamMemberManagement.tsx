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
        },[]);

    const handleCreateTeamMember = async (event:React.SubmitEvent) =>{       
            event.preventDefault();
            setMemberMessage("");
    
            try{
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
    
            } catch(error){
                setMemberMessage("Failed to create team member");
            }
        }

    return (
        <div>
            <h3>Team Member Management</h3>
            <h3>Add Team Member</h3>
                    <form onSubmit={handleCreateTeamMember}>
                        <div>
                            <label>Name</label>
                            <input
                                type="text"
                                value={memberName}
                                onChange={(event) => setMemberName(event.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Email</label>
                            <input
                                type="email"
                                value={memberEmail}
                                onChange={(event) => setMemberEmail(event.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Password</label>
                            <input
                                type="password"
                                value={memberPassword}
                                onChange={(event) => setMemberPassword(event.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <button type="submit">Add Team Member</button>
                    </form>
                    {memberMessage && <p>{memberMessage}</p>}

                    <h3>Team Members</h3>
                    { teamMembers.length===0?(<p>No team members found</p>)
                    : 
                    (
                        <div>
                            {teamMembers.map((member) =>(
                                <div key={member._id}>
                                    <p>Name: {member.name}</p>
                                    <p>Email: {member.email}</p>
                                    <p>Role: {member.role}</p>
                                </div>
                            ))}
                        </div>
                    )}
        </div>
    );
};

export default TeamMemberManagement;