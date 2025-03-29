import InputForm from "../../components/inputForm/inputForm";
import Logo from "../../components/logo/logo";
import FormButton from "../../components/formButton/formButton";
import { Link } from "react-router-dom";
import { useForm } from 'react-hook-form';
import login_request from "../../services/api/login_register";
import "./loginPageStyle.css";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useUser from "../../hooks/useUser";
import get_info_by_token from "../../services/api/info_token";

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
   

    const login_func = async (content: loginInterface) => {
        // Precisa validar certinho o retorno da API nessa parte aqui para ver se está sendo utilizado uma estrutura correta
        const auth_token  = await login_request( content );         
        if (auth_token.auth_token) {
            console.log("estou aqui :)")
            const data  = await get_info_by_token(auth_token.auth_token);                        
            if (data) {
                const { name, cnpj, id, email, picture, is_verified, phone_number } = data;
                const token = auth_token.auth_token;
                const auth = true;                
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
        <form className="login-bg" onSubmit={handleSubmit(login_func)}>
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