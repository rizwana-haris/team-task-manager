import api from "./api";

export interface CreateTeamMemberData {
  name: string;
  email: string;
  password: string;
}

export interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: "team_member";
}

export const createTeamMember = async (memberData: CreateTeamMemberData):Promise<TeamMember> => {
    const response = await api.post("/user", memberData);
 
    return response.data.user;
}

export const getTeamMembers = async (): Promise<TeamMember[]> => {
  const response = await api.get("/user/team-members");

  return response.data.users;
};