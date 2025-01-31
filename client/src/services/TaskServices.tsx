import axios from "axios";

const BASE_URL = 'http://localhost:3000/api';

export const getCurrentUserTasks = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/current-user-tasks`);
        return { data: response.data, error: null, status: response.status };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            return { data: null, error: { message: "Unauthorized" }, status: 401 };
        }
        return { data: null, error: { status: 500, message: "Server Error" } };
    }
};

export const getCategories = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/categories`);
        return { data: response.data, error: null, status: response.status };
    } catch (error) {
        return { data: null, error: { error } };
    }
}

export const getProjects = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/projects`);
        return { data: response.data, error: null, status: response.status };
    } catch (error) {
        return { data: null, error: { error } };
    }
}

export const createTask = async (task: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/create-task`, {task});
        return { data: response.data, error: null, status: response.status };
    } catch (error) {
        return { data: null, error: { error } };
    }
}

export const getTaskById = async (id: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/task/${id}`);
        const dataWithTags = { ...response.data, tags: response.data.tags.map((tag: any) => tag.title) };
        return { data: dataWithTags, error: null, status: response.status };
    } catch (error) {
        return { data: null, error: { error } };
    }
}

export const updateTask = async (task: any) => {
    try {
        const response = await axios.put(`${BASE_URL}/update-task/${task.id}`, {task});
        return { data: response.data, error: null, status: response.status };
    } catch (error) {
        return { data: null, error: { error } };
    }
}

export const deleteTask = async (id: string) => {
    try {
        const response = await axios.delete(`${BASE_URL}/delete-task/${id}`);
        return { data: response.data, error: null, status: response.status };
    } catch (error) {
        return { data: null, error: { error } };
    }
}