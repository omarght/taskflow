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

export const getProjectById = async (id: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/project/${id}`);
        return { project: response.data, error: null, status: response.status };
    } catch (error) {
        return { data: null, error: { error } };
    }
}

export const getProjectTasks = async (id: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/project-tasks/${id}`);
        return { tasks: response.data, error: null, status: response.status };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            return { data: null, error: { message: "Unauthorized" }, status: 401 };
        }
        return { data: null, error: { error } };
    }
}