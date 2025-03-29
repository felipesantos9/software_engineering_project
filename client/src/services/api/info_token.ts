import api from "../api";

const get_info_by_token = async (token:string) => {
    try {
        const headers = {
          "Authorization": `Token ${token}`
        };
        console.log(headers);
        const response = await api.get('auth/users/me/', {headers: headers});               
        const data  = response.data;        
        return data;
  
    } catch (error:any) {
      return error.code;
    };
  };

export default get_info_by_token;