import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

const api = axios.create({ baseURL: `${API_BASE_URL}/api` });

export const tripRegisterRequest = async (parameters: TripInterface) => {
    try {
        const response = await api.post("estimates/create/", parameters);
        const { data } = response;
        return data;
    } catch (error: any) {
        const { data } = error.response;
        return data;
    }
};