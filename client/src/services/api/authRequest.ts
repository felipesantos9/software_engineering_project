import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

const api = axios.create({ baseURL: `${API_BASE_URL}/auth` });

export const loginRequest = async (parameters: loginInterface) => {
  try {
    const response = await api.post("token/login/", parameters);
    const { data } = response;
    return data;
  } catch (error: any) {
    return error.code;
  }
};

export const sendEmailRequest = async (parameters: sendEmailInterface) => {
  try {
    const response = await api.post("users/reset_password/", parameters);
    const { data } = response;
    return data;
  } catch (error: any) {
    const { data } = error.response;
    return data;
  }
};

export const getInfoToken = async (token: string) => {
  try {
    const headers = {
      Authorization: `Token ${token}`,
    };
    const response = await api.get("users/me/", { headers: headers });
    const data = response.data;
    return data;
  } catch (error: any) {
    return error.code;
  }
};

export const registerRequest = async (parameters: loginInterface) => {
  try {
    const response = await api.post("users/", parameters);
    const { data } = response;
    return data;
  } catch (error: any) {
    return null;
  }
};
