import api from "../api";

const login_request = async (parameters:loginInterface) => {  
  try {
        const response = await api.post('auth/token/login/', parameters)
        const { data } = response;        
        return data;
      } catch (error: any) {                
        return error.code;
    }
};

export default login_request;