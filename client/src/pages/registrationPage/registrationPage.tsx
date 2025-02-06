import InputForm from "../../components/inputForm/inputForm";
import Logo from "../../components/companyIcon/companyIcon";
import FormButton from "../../components/buttonInitial/buttonInitial";
import "./registrationPageStyle.css";

function RegistrationPage() {
  return (
    <form className="registration-bg">
      <div className="registrationPage-container">
        <Logo />
        <h2>Cadastro</h2>

        <InputForm
          placeholderText="Nome empresa"
          inputId="company-name"
          labelTitle="Nome empresa"
          typeInput="text"
        />

        <InputForm
          placeholderText="exemplo@exemplo.com"
          inputId="email"
          labelTitle="Email"
          typeInput="text"
        />

        <InputForm
          placeholderText="(01) 23456-7890"
          inputId="phone"
          labelTitle="Telefone"
          typeInput="text"
        />

        <InputForm
          placeholderText="00.00.000/0000-00"
          inputId="cnpj"
          labelTitle="CNPJ"
          typeInput="text"
        />

        <InputForm
          placeholderText="***********"
          inputId="password"
          labelTitle="Senha"
          typeInput="password"
        />

        <InputForm
          placeholderText="***********"
          inputId="confirm-password"
          labelTitle="Confirmar senha"
          typeInput="password"
        />

        <FormButton content="Cadastrar" />

        <div className="bottom-paragraph-register-elements">
          <div className="login-text">
            <a href="#">Já possui uma conta? Faça login</a>
          </div>
        </div>
      </div>
    </form>
  );
}

export default RegistrationPage;