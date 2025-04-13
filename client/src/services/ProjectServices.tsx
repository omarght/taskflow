import axios from "axios";

const BASE_URL = 'http://localhost:3000/api';

export const getAllProjects = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/projects`);
        return { projects: response.data.projects, error: null, status: response.status };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            return { data: null, error: { message: "Unauthorized" }, status: 401 };
        }
        return { data: null, error: { error } };
    }
}

export const getProjectById = async (teamId: string, id: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/teams/${teamId}/projects/${id}`);
        return { project: response.data.project, error: null, status: response.status };
    } catch (error) {
        return { data: null, error: { error } };
    }
}

export const getProjectTasks = async (teamId: string, id: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/teams/${teamId}/project-tasks/${id}`);
        return { tasks: response.data, error: null, status: response.status };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            return { data: null, error: { message: "Unauthorized" }, status: 401 };
        }
        return { data: null, error: { error } };
    }
}

export const createProject = async (payload: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/create-project`, payload);
        return { data: response.data, error: null, status: response.status };
    } catch (error) {
        return { data: null, error: { error } };
    }
}

export const updateProject = async (payload: any) => {
    try {
        const response = await axios.put(`${BASE_URL}/update-project/${payload.id}`, payload);
        return { data: response.data, error: null, status: response.status };
    } catch (error) {
        return { data: null, error: { error } };
    }
}

export const deleteProject = async (id: string) => {
    try {
        const response = await axios.delete(`${BASE_URL}/delete-project/${id}`);
        return { data: response.data, error: null, status: response.status };
    } catch (error) {
        return { data: null, error: { error } };
    }
}

export const getTeamProjects = async (teamId: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/get-team-projects/${teamId}`);
        return { projects: response.data, error: null, status: response.status };
    } catch (error) {
        return { data: null, error: { error } };
    }
}