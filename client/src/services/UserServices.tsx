import axios from "axios";

const BASE_URL = 'http://localhost:3000/api';

export const getUserById = async (id: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/user/${id}`);
        return { data: response.data, error: null, status: response.status };
    } catch (error) {
        return { data: null, error: { error } };
    }
}

export const getCurrentUser = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/current-user`);
        return { data: response.data, error: null, status: response.status };
    } catch (error) {
        return { data: null, error: { error } };
    }
}