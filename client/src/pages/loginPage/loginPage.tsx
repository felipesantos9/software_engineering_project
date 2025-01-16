import InputForm from "../../components/inputForm/inputForm";
import CompanyIcon from "../../components/companyIcon/companyIcon";
import ButtonInitial from "../../components/buttonInitial/buttonInitial";
import "./loginPageStyle.css";

function LoginPage () {
    
    let aoba = true;
    const teste = () => !aoba;
    
    return(
        <div className="loginPage-container">
            
            <CompanyIcon/>
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
            
            <ButtonInitial 
            content="Entrar"/>
            
            <div className="bottom-paragraph-login-elements">
                <div>
                    <a>Esqueci a senha</a>
                </div>

                <div className="register-text">                    
                    <a>Não tem uma conta? Cadastre-se 🌲</a>
                </div>
            
            </div>
        </div>  
    );

};

export default LoginPage;