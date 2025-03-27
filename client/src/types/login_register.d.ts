// Interfaces criadas para o uso do login


// Interface do payload que vamos enviar para a requisição
interface loginInterface {
    email: string;
    password: string;
};

// Interface que será utilizada como retorno da função de fazer login (acredito que seja necessário validar o que irá retornar)
interface loginDataContext {
        id: number;
        username: string;
        auth: boolean;
        token: string | null;
        role: 'user'; // Por enquanto, teremos apenas um tipo de role, que será o user, porém isso pode mudar com a alteração do requisito 
};

// Entender melhor essa interface
interface loginContext {
    user: loginDataContext;
    updateUser: (newUser: loginDataContext) => void;
    logoutUser: () => void;
};
