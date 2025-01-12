import "./inputFormStyle.css";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { useState } from "react";

interface InputFormProps {
    placeholderText: string;
    labelTitle: string;
    typeInput: string; // 'text' -> Texto Normal , 'password' -> Senhas (vai ficar aquele bagulhinho escondido :) ) 
}


function InputForm({ placeholderText, labelTitle, typeInput}: InputFormProps) {    
    const [show, setShow] = useState(false); 


    let type = false;

    if (typeInput == 'password') {
        // Incluir o botãozinho de mostrar e alterar o placeholderText
        placeholderText = '********'; // Mudar isso aqui depois!!
        type = true;

    };
    
    function changeMode () {
        setShow(!show);
        // Nessa condição aqui já vai estar com a alteração feita antes, então se ligar para não confundir
        // Colocar as configurações referente ao status da condição 
        // Ou seja, show == True -> Olho abertinho (alterar o type do input para text e por precaução o placeholder :))
        // show == False -> Olho fechadinho (alterar o type do input para password e por precaução o placeholder para ********)
        
        if (show) {
            typeInput = 'text';
            placeholderText = ' ';
        } else {
            typeInput = 'password';
            placeholderText = '********';
        }
        
    };

    return(
        <form className="form-style">
        <label className="label-style">{labelTitle}</label> <br/>
            <div className="input-group">
            <input type={typeInput} placeholder={placeholderText} size={30} maxLength={30} className="input-style"/>
            {type ? 
            
            <button className="button-style" onClick={changeMode}>
            {show ?  <VscEye/>: <VscEyeClosed/>}
            </button> 
            
            : null}
            </div>                 
        </form>
    );
};

//() => setShow(!show) 

export default InputForm;