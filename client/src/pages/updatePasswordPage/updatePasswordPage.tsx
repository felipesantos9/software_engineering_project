import InputForm from "../../components/inputForm/inputForm";
import Logo from "../../components/logo/logo";
import FormButton from "../../components/formButton/formButton";
import { useForm } from 'react-hook-form';
import './updatePasswordPageStyle.css';
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useUser from "../../hooks/useUser";

function UpdatePasswordPage () {
    // Em tese, deveria ser usado o context que vai armazenar o email e aquele id de confirmação para fazer as alterações com sucesso 
    //const { updateUser, user } = useUser(); 

    const navigate = useNavigate();

    const { 
        register,
        handleSubmit,
        formState: { errors },
     } = useForm<passwordsInterface>();
    
    
    const updateFunc = async (content: passwordsInterface) => { 
        if (content.password1 == content.password2) {            
            toast.success('coincide hein', {duration: 2000});
        } else {
            toast.error('Senhas não coincidem. Tente novamente!', {duration:2000});
        };                       
        
    };

    // Devido à similaridade do CSS, as nomenclaturas são semelhantes ao de login, sendo até mesmo utilizado o mesmo arquivo CSS como referência
    return(               
        <form className="login-bg" onSubmit={handleSubmit(updateFunc)}>
            <Toaster />
            <div className="loginPage-container">            
                <Logo/>
                <h2>Atualizar Senha</h2>
                    <InputForm 
                placeholderText="***********"
                inputId="newPassword"
                labelTitle="Nova senha"
                typeInput="password"
                register = {register} />  
                
                    <InputForm 
                placeholderText="***********"
                inputId="confirmationNewPassword"
                labelTitle="Confirmação da nova senha"
                typeInput="password"
                register = {register} />       
                
                <FormButton 
                content="Atualizar"/>
                                
            </div>
        </form> 
    );

};

export default UpdatePasswordPage;