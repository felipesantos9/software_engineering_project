import InputForm from "../../components/inputForm/inputForm";
import Logo from "../../components/logo/logo";
import FormButton from "../../components/formButton/formButton";
import { Link } from "react-router-dom";
import { useForm } from 'react-hook-form';
import loginRequest from "../../services/api/login_register";
import "./loginPageStyle.css";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useUser from "../../hooks/useUser";
import getInfoToken from "../../services/api/info_token";

function LoginPage () {
    const [ message, setMessage ] = useState('');
    const { updateUser, user } = useUser(); 

    const navigate = useNavigate();

    const { 
        register,
        handleSubmit,
        formState: { errors },
     } = useForm<loginInterface>();
    
    
    useEffect(() => {
    if (user.auth) {
        navigate('/');
    }
    }, [navigate, user.auth]);
   

    const loginFunc = async (content: loginInterface) => {
        const authToken  = await loginRequest( content );         
        if (authToken.auth_token) {            
            const data  = await getInfoToken(authToken.auth_token);                        
            if (data) {
                const { name, cnpj, id, email, picture, is_verified, phone_number } = data;
                const token = authToken.auth_token;
                const auth = true;

                localStorage.setItem('USER_TOKEN', token); // Armazenando o token

                if (updateUser) {                                      
                    updateUser({
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
                toast.success("Login deu certo :)", {duration:2000});
            } else {
                toast.error("Login deu errado :(", {duration:2000})
            };
                    
        } else {
            toast.error("Login deu errado :(", {duration:2000})
        };
    };

    return(               
        <form className="login-bg" onSubmit={handleSubmit(loginFunc)}>
            <Toaster />
            <div className="loginPage-container">            
                <Logo/>
                <h2>Login</h2>
                    <InputForm 
                placeholderText="email@email.com"
                inputId="email"
                labelTitle="Email"
                typeInput="text" 
                register = {register}/>
                
                    <InputForm 
                placeholderText="***********"
                inputId="password"
                labelTitle="Senha"
                typeInput="password"
                register = {register} />       
                
                <FormButton 
                content="Entrar"/>
                
                <div className="bottom-paragraph-login-elements">
                    <div>
                        <a>Esqueci a senha</a>
                    </div>

                    <div className="register-text">                    
                        <Link to="/register">Não tem uma conta? Cadastre-se 🌲</Link>
                    </div>
                
                </div>
            </div>
        </form> 
    );

};

export default LoginPage;