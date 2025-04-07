import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const api = axios.create({ baseURL: `${API_BASE_URL}/api` });

export const tripRegisterRequest = async (parameters: TripInterface, token: string) => {
  const headers = {
    Authorization: `Token ${token}`,
  };
  try {
    const response = await api.post("estimates/create/", parameters, { headers });
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

export const getTrips = async (token: string,) => {
  try {
    const headers = {
      Authorization: `Token ${token}`,
    };
    const response = await api.get("estimates/list/", { headers, });
    const data = response.data.results;
    return data;
  } catch (error: any) {
    return error.code;
  }
};

export const getReport = async (token: string, endDate: string, startDate: string) => {
  try {
    const headers = {
      Authorization: `Token ${token}`,
    };
    const params = {
      start_date: startDate,
      end_date: endDate,
    };
    const response = await api.get("estimates/emissions-report", { headers, params});
    const data = response.data;
    return data;
  } catch (error: any) {
    return error.code;
  }
};