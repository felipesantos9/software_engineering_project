import InputForm from "../../components/inputForm/inputForm";
import Logo from "../../components/logo/logo";
import FormButton from "../../components/formButton/formButton";
import { useForm } from 'react-hook-form';
import "../../styles/loginUpdateStyle.css";
import "./forgotPasswordPageStyle.css";
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ConfirmIcon from "../../components/confirmIcon/confirmIcon";
import { sendEmailRequest } from "../../services/api/authRequest";

function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<sendEmailInterface>();

    const backLogin = () => {
        navigate('/')
    };

    const sendEmail = async (content: sendEmailInterface) => {
        console.log(content);
        const { emailResponse } = await sendEmailRequest(content);
        if (emailResponse) {
            setEmail(true);
        } else {
            toast.error("Error ao tentar enviar o email", { duration: 2000 })
        };
    };

    return (
        <form className="general-bg" onSubmit={handleSubmit(sendEmail)}>
            <Toaster />
            <div className="principal-container">
                <Logo />
                <h2>Esqueci a senha</h2>
                {email ? <div className="centralize-content">
                    <ConfirmIcon />
                    <div className="description-container">
                        <p>Um link de verificação foi enviado ao seu e-mail. Para prosseguir, gentileza verificar a caixa de entrada.</p>
                    </div>
                </div>
                    :
                    <div className="centralize-content"><InputForm
                        placeholderText="exemplo@exemplo.com"
                        inputId="forgotPasswordEmail"
                        labelTitle="Email"
                        typeInput="email"
                        register={register} />

                        <div className="description-container">
                            <p>Enviaremos um código de verificação a este e-mail se corresponder a uma conta do nosso sistema.</p>
                        </div>

                        <FormButton
                            content="Enviar"
                            darkGreen={false}
                            isDisabled={true} />

                        <button className="backButton" type="button" onClick={backLogin}>
                            Voltar
                        </button>
                    </div>
                }
            </div>
        </form>
    );

};

export default ForgotPasswordPage;