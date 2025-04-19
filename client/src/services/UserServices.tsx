import axios from "axios";

const BASE_URL = 'http://localhost:3000/api';

type team = {
    id: string;
    name: string;
}

type user = {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

type data = {
    user: user;
    createdAt: string;
    updatedAt: string;
    teams: team[];
    task_count: number;
    open_tasks: number;
    completed_tasks: number;
    overdue_tasks_count: number;
}

interface UserByIdResponse {
    data: data | null,
    status: number;
    error: null | { error: unknown };
}

export const getUserById = async (id: string):Promise<UserByIdResponse> => {
    try {
        const response = await axios.get(`${BASE_URL}/user/${id}`);
        return { data: response.data, error: null, status: response.status };
    } catch (error) {
        return { data: null, error: { error }, status: 500 };
    }
}

export const getCurrentUser = async ():Promise<UserByIdResponse> => {
    try {
        const response = await axios.get(`${BASE_URL}/current-user`);
        console.log('response', response);
        return { data: response.data, error: null, status: response.status };
    } catch (error) {
        return { data: null, error: { error }, status: 500 };
    }
}