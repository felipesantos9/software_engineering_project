import api from "../api";

const sendEmailRequest = async ( parameters:sendEmailInterface ) => {
    try {        
        const response = await api.post('/auth/users/reset_password/', parameters)
        const { data } = response;
        return data;
      } catch (error: any) {
        const { data } = error.response;
        return data;
    }
};

export default sendEmailRequest;