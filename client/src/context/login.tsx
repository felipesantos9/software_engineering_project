import { ReactNode, useEffect, useState, createContext  } from "react";
import { jwtDecode } from 'jwt-decode'; // Codificação do token

interface IChildrenUserProvider {
    children: ReactNode;
};

interface IJwtPayload {
    username: string;
    id: number;
    role: 'user';
}

export const UserContext = createContext<loginContext | null>(null);

export default function UserProvider ( { children }: IChildrenUserProvider ) {
    const [user, setUser] = useState<loginDataContext>({
        auth: false,
        username: 'Visitor',
        token: null,
        id: NaN,
        role: 'user',
    });


  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('USER_TOKEN');
      if (token) {
        try {
        const tokenDecoded = jwtDecode(token) as IJwtPayload;
        const { username, id, role } = tokenDecoded;        
        setUser({
          auth: true,
          username,         
          token,
          id: Number(id),
          role,
        });
    } catch (error: any) {
        // Depois colocar algum tratamento de erro aqui
        console.log("deu erro aqui hein xD")
    }
    }
    };
    verifyToken();
  }, []);


  // Funções para lidar com atualização do usuário (null ---> User ou User ----> null) 
  function handleUpdateUser (newUser: loginDataContext) {
    setUser(newUser)
  };

  function handleLogout () {
    setUser({
        auth: false,
        username: "Visitor",         
        token: null,
        id: NaN,
        role: "user",  
    });    
  };

  return(
    <UserContext.Provider value={{user, updateUser:handleUpdateUser, logoutUser: handleLogout}}>
        {children}
    </UserContext.Provider>
  );

};