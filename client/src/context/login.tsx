import { ReactNode, useEffect, useState, createContext } from "react";
import { useCookies } from "react-cookie";
import { getInfoToken } from "../services/api/authRequest";

interface IChildrenUserProvider {
  children: ReactNode;
};

export const UserContext = createContext<loginContext | null>(null);

export default function UserProvider({ children }: IChildrenUserProvider) {
  const [cookies, setCookie] = useCookies(["user-token"]);

  const [user, setUser] = useState<loginDataContext>({
    name: '',
    cnpj: '',
    id: NaN,
    email: '',
    picture: '',
    is_verified: false,
    phone_number: '',
    token: '',
    auth: false
  });


  useEffect(() => {
    const verifyToken = async () => {
      const cookie = cookies["user-token"];
      if (cookie) {
        const data = await getInfoToken(cookie);
        if (data) {
          const { name, cnpj, id, email, picture, is_verified, phone_number } = data;
          const token = cookie;
          const auth = true;

          setCookie('user-token', token);

          setUser({
            name,
            cnpj,
            id,
            email,
            picture,
            is_verified,
            phone_number,
            token,
            auth
          })

        }
      };
    }
    verifyToken();
  }, []);


  // Funções para lidar com atualização do usuário (null ---> User ou User ----> null) 
  function handleUpdateUser(newUser: loginDataContext) {
    setUser(newUser)
  };

  function handleLogout() {
    setUser({
      name: '',
      cnpj: '',
      id: NaN,
      email: '',
      picture: '',
      is_verified: false,
      phone_number: '',
      token: '',
      auth: false
    });    
    setCookie("user-token", "");
  };

  return (
    <UserContext.Provider value={{ user, updateUser: handleUpdateUser, logoutUser: handleLogout }}>
      {children}
    </UserContext.Provider>
  );

};