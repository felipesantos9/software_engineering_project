// Interfaces criadas para o uso do login

// Interface do payload que vamos enviar para a requisição
interface loginInterface {
    email: string;
    password: string;
};

// Interface que será utilizada como retorno da função de fazer login (acredito que seja necessário validar o que irá retornar)
interface loginDataContext {
        name: string;                            
        cnpj: string;
        id: number;
        email: string;
        picture: string | null;
        is_verified: boolean;
        phone_number: string | null;                        
        token: string | null;
        auth: boolean;
};

interface loginContext {
    user: loginDataContext;
    updateUser: (newUser: loginDataContext) => void;
    logoutUser: () => void;
};

interface RegisterInterface {
    name: string;
    cnpj: string;
    phonenumber: string;
    email: string;
    password: string;
    confirmPassword: string;
}
