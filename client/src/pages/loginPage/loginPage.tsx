import InputForm from "../../components/inputForm/inputForm";
import Logo from "../../components/logo/logo";
import FormButton from "../../components/formButton/formButton";
import { Link } from "react-router-dom";
import "./loginPageStyle.css";

function LoginPage () {
    return(        
        <form className="login-bg">
            <div className="loginPage-container">            
                <Logo/>
                <h2>Login</h2>
                    <InputForm 
                placeholderText="email@email.com"
                inputId="email"
                labelTitle="Email"
                typeInput="text" />
                
                    <InputForm 
                placeholderText="***********"
                inputId="password"
                labelTitle="Senha"
                typeInput="password" />       
                
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