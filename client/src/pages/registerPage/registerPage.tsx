import InputForm from "../../components/inputForm/inputForm";
import Logo from "../../components/logo/logo";
import { Link, useNavigate } from "react-router-dom";
import "./registrationPageStyle.css";
import { useForm } from "react-hook-form";
import { userRegisterSchema } from "../../schemas/company";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "../../components/formButton/formButton";
import { registerRequest } from "../../services/api/authRequest";

export default function RegistrationPage() {
  const [buttonIsDisabled, setButtonIsDisabled] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterInterface>({
    resolver: zodResolver(userRegisterSchema),
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      for (const key in errors) {
        const message = errors[key as keyof RegisterInterface]?.message as string;
        toast.error(message, { duration: 2000 });
      }
    }
  }, [errors]);

  const removeSymbols = (value: string) => {
    return value.replace(/\D/g, '');
  };

  const handleRegister = async (dataForm: RegisterInterface) => {
    dataForm.phonenumber = removeSymbols(dataForm.phonenumber);
    dataForm.cnpj = removeSymbols(dataForm.cnpj);
    setButtonIsDisabled(true);

    const response = await registerRequest(dataForm);

    if (response) {
      toast.success('Usuário criado com sucesso', { duration: 2000 });
    } else {
      toast.error('Algo deu errado ao realizar o login', { duration: 2000 });
    }

    setTimeout(() => {
      if (!response) {
        setButtonIsDisabled(false);
        return;
      }
      navigate('/login');

    }, 2000);

  };

  return (
    <div className="registration-bg">
      <Toaster />
      <form className="registrationPage-container" onSubmit={handleSubmit(handleRegister)}>
        <Logo />
        <h2>Cadastro</h2>

        <InputForm
          placeholderText="Nome empresa"
          inputId="name"
          labelTitle="Nome empresa"
          typeInput="text"
          register={register}
          setValue={setValue}

        />

        <InputForm
          placeholderText="exemplo@exemplo.com"
          inputId="email"
          labelTitle="Email"
          typeInput="text"
          register={register}
          setValue={setValue}
        />

        <InputForm
          placeholderText="(01) 23456-7890"
          inputId="phonenumber"
          labelTitle="Telefone"
          typeInput="text"
          register={register}
          setValue={setValue}
        />

        <InputForm
          placeholderText="00.00.000/0000-00"
          inputId="cnpj"
          labelTitle="CNPJ"
          typeInput="text"
          register={register}
          setValue={setValue}
        />

        <InputForm
          placeholderText="***********"
          inputId="password"
          labelTitle="Senha"
          typeInput="password"
          register={register}
          setValue={setValue}
        />

        <InputForm
          placeholderText="***********"
          inputId="confirmPassword"
          labelTitle="Confirmar senha"
          typeInput="password"
          register={register}
          setValue={setValue}
        />

        <FormButton content="Cadastrar" darkGreen={false} isDisabled={buttonIsDisabled} />

        <div className="bottom-paragraph-register-elements">
          <div className="login-text">
            <Link to="/">Já possui uma conta? Faça login</Link>
          </div>
        </div>
      </form>
    </div>
  );
}

