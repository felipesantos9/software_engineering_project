import InputForm from "../../components/inputForm/inputForm";
import Logo from "../../components/logo/logo";
import FormButton from "../../components/formButton/formButton";
import { useForm } from 'react-hook-form';
import "../../styles/loginUpdateStyle.css";
import "./forgotPasswordPageStyle.css";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ConfirmIcon from "../../components/confirmIcon/confirmIcon";
import { sendEmailRequest } from "../../services/api/authRequest";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "../../schemas/company";

function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState(false);
    const [buttonIsDisabled, setButtonIsDisabled] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<sendEmailInterface>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            for (const key in errors) {
                const message = errors[key as keyof sendEmailInterface]?.message as string;
                toast.error(message, { duration: 2000 });
            }
        }
    }, [errors]);

    const backLogin = () => {
        navigate(-1);
    };

    const sendEmail = async (content: sendEmailInterface) => {
        setButtonIsDisabled(true);
        const { emailResponse } = await sendEmailRequest(content);
        if (emailResponse) {
            setEmail(true);
        } else {
            toast.error("Error ao tentar enviar o email", { duration: 2000 })
        };
        setTimeout(() => {
            setButtonIsDisabled(false);
        }, 2000);
    };

    return (
        <div className="general-bg" >
            <Toaster />
            <form className="principal-container" onSubmit={handleSubmit(sendEmail)}>
                <Logo />
                <h2>Esqueci a senha</h2>
                {email ? <div className="centralize-content">
                    <ConfirmIcon />
                    <div className="description-container">
                        <p>Um link de verificação foi enviado ao seu e-mail. Para prosseguir, gentileza verificar a caixa de entrada.</p>
                    </div>
                </div>
                    :
                    <div className="centralize-content">
                        <InputForm
                            placeholderText="exemplo@exemplo.com"
                            inputId="email"
                            labelTitle="Email"
                            typeInput="email"
                            register={register} setValue={setValue} />

                        <div className="description-container">
                            <p>Enviaremos um código de verificação a este e-mail se corresponder a uma conta do nosso sistema.</p>
                        </div>

                        <FormButton
                            content="Enviar"
                            darkGreen={false}
                            isDisabled={buttonIsDisabled} />

                        <button className="backButton" type="button" onClick={backLogin}>
                            Voltar
                        </button>
                    </div>
                }
            </form>
        </div>
    );

};

export default ForgotPasswordPage;