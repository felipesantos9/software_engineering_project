import InputForm from "../../components/inputForm/inputForm";
import Logo from "../../components/logo/logo";
import FormButton from "../../components/formButton/formButton";
import { Link } from "react-router-dom";
import { useForm } from 'react-hook-form';
import login_request from "../../services/api/login_register";
import "../../styles/loginUpdateStyle.css";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useUser from "../../hooks/useUser";



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
        const { msg, error, token, auth, username, id, role } = await login_request( content );        
        setMessage(msg);

        localStorage.setItem('USER_TOKEN', token);

        if (error) {
            toast.error(msg, {duration: 2000});
            return;
        };

        if (updateUser) {
            updateUser({
                id,
                auth,
                token,
                username,
                role,
            });
        };
    };
    return(               
        <form className="general-bg" onSubmit={handleSubmit(login_func)}>
            <Toaster />
            <div className="principal-container">            
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
                content="Entrar"
                darkGreen={false}/>
                
                <div className="bottom-paragraph-container-elements">
                    <div>
                        <a>Esqueci a senha</a>
                    </div>

                    <div className="highlighted-text">                    
                        <Link to="/register">Não tem uma conta? Cadastre-se 🌲</Link>
                    </div>
                
                </div>
            </div>
        </form> 
    );

};

export default LoginPage;