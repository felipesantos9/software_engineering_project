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

export const getEstimates = async (token: string, endDate: string, startDate: string) => {
    try {
      const headers = {
        Authorization: `Token ${token}`,
      };
      const params = {
        start_date: startDate,
        end_date: endDate,
      };
      const response = await api.get("estimates/dashboard/", { headers, params });
      const data = response.data;
      return data;
    } catch (error: any) {
      return error.code;
    }
  };