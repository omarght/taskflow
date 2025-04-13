import axios from "axios";

const BASE_URL = 'http://localhost:3000/api';

export const getAllTeams = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/teams`);
        return { teams: response.data, error: null, status: response.status };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            return { data: null, error: { message: "Unauthorized" }, status: 401 };
        }
        return { data: null, error: { error } };
    }
}

export const getTeamById = async (id: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/teams/${id}`);
        return { team: response.data, error: null, status: response.status };
    } catch (error) {
        return { data: null, error: { error } };
    }
}

export const createTeam = async (team: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/create-team`, {team});
        return { data: response.data, error: null, status: response.status };
    } catch (error) {
        return { data: null, error: { error } };
    }
}

export const updateTeam = async (team: any) => {
    try {
        const response = await axios.put(`${BASE_URL}/update-team/${team.id}`, {team});
        return { data: response.data, error: null, status: response.status };
    } catch (error) {
        return { data: null, error: { error } };
    }
}

export const deleteTeam = async (id: string) => {
    try {
        const response = await axios.delete(`${BASE_URL}/delete-team/${id}`);
        return { data: response.data, error: null, status: response.status };
    } catch (error) {
        return { data: null, error: { error } };
    }
}

export const getTeamTasks = async (id: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/team-tasks/${id}`);
        return { tasks: response.data, error: null, status: response.status };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            return { data: null, error: { message: "Unauthorized" }, status: 401 };
        }
        return { data: null, error: { error } };
    }
}

export const getTeamProjects = async (id: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/team-projects/${id}`);
        return { projects: response.data, error: null, status: response.status };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            return { data: null, error: { message: "Unauthorized" }, status: 401 };
        }
        return { data: null, error: { error } };
    }
}

export const getTeamMembers = async (id: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/team-members/${id}`);
        return { members: response.data, error: null, status: response.status };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            return { data: null, error: { message: "Unauthorized" }, status: 401 };
        }
        return { data: null, error: { error } };
    }
}

export const getAllTeamMembers = async (teamId: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/all-team-members/${teamId}`);
        return { members: response.data, error: null, status: response.status };
    } catch (error) {
        return { data: null, error: { error } };
    }
}

export const getAllTeamMembersByProject = async (projectId: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/all-team-members-by-project/${projectId}`);
        return { members: response.data, error: null, status: response.status };
    } catch (error) {
        return { data: null, error: { error } };
    }
}

export const getNoneMembers = async (teamId: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/non-team-members/${teamId}`);
        return { members: response.data, error: null, status: response.status };
    } catch (error) {
        return { data: null, error: { error } };
    }
}

export const addTeamMember = async (team_id: string, user_id: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/add-team-member`, {team_id, user_id});
        return { data: response.data, error: null, status: response.status };
    } catch (error) {
        return { data: null, error: { error } };
    }
}

export const inviteUser = async (name: string, email: string, team_id: string) => {
    console.log('email', email);
    try {
        const response = await axios.post(`${BASE_URL}/invite`, { name, email, team_id });
        return { data: response.data, error: null, status: response.status };
    } catch (error: any) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.errors || "Something went wrong";
        return { data: null, error: message, status };
    }
};

export const deleteTeamMember = async (team_id: string, user_id: string) => {
    try {
        const response = await axios.delete(`${BASE_URL}/remove-team-member`, { data: { team_id, user_id } });
        return { data: response.data, error: null, status: response.status };
    } catch (error) {
        return { data: null, error: { error } };
    }
}