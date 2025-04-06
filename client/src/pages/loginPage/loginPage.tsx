import InputForm from "../../components/inputForm/inputForm";
import Logo from "../../components/logo/logo";
import FormButton from "../../components/formButton/formButton";
import { Link } from "react-router-dom";
import { useForm } from 'react-hook-form';
import "../../styles/loginUpdateStyle.css";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useUser from "../../hooks/useUser";
import { useCookies, CookiesProvider } from 'react-cookie';
import { getInfoToken, loginRequest } from "../../services/api/authRequest";

function LoginPage() {
    const { updateUser, user } = useUser();
    const [cookies, setCookie] = useCookies(["user-token"]);

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<loginInterface>();

    useEffect(() => {
        const getData = async () => {
            if (cookies["user-token"]) {
                const data = await getInfoToken(cookies["user-token"]);
                console.log("testeee")
                if (data) {
                    const { name, cnpj, id, email, picture, is_verified, phone_number } = data;
                    const token = cookies["user-token"];
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
                };
            };
        }
        getData();
    }, []);


    useEffect(() => {
        if (user.auth) {
            navigate('/');
        }
    }, [navigate, user.auth]);


    const loginFunc = async (content: loginInterface) => {
        const authToken = await loginRequest(content);
        if (authToken.auth_token) {
            const data = await getInfoToken(authToken.auth_token);
            if (data) {
                const { name, cnpj, id, email, picture, is_verified, phone_number } = data;
                const token = authToken.auth_token;
                const auth = true;

                localStorage.setItem('USER_TOKEN', token);

                setCookie('user-token', token);

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
                toast.success("Login deu certo :)", { duration: 2000 });
            } else {
                toast.error("Login deu errado :(", { duration: 2000 })
            };

        } else {
            toast.error("Login deu errado :(", { duration: 2000 })
        };
    };

    return (
        <form className="general-bg" onSubmit={handleSubmit(loginFunc)}>
            <Toaster />
            <div className="principal-container">
                <Logo />
                <h2>Login</h2>
                <InputForm
                    placeholderText="email@email.com"
                    inputId="email"
                    labelTitle="Email"
                    typeInput="text"
                    register={register} />

                <InputForm
                    placeholderText="***********"
                    inputId="password"
                    labelTitle="Senha"
                    typeInput="password"
                    register={register} />

                <FormButton
                    content="Entrar"
                    darkGreen={false}
                    isDisabled={true}
                />

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