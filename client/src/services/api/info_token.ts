import api from "../api";

const getInfoToken = async (token:string) => {
    try {
        const headers = {
          "Authorization": `Token ${token}`
        };
        const response = await api.get('auth/users/me/', {headers: headers});               
        const data  = response.data;        
        return data;
  
    } catch (error:any) {
      return error.code;
    };
  };

export default getInfoToken ;