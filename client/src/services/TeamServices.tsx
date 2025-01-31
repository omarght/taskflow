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
        const response = await axios.get(`${BASE_URL}/team/${id}`);
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