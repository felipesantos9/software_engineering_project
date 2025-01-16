import "./inputFormStyle.css";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { useState } from "react";

interface InputFormProps {
    placeholderText: string;
    labelTitle: string;
    typeInput: 'text' | 'password' | 'email'; // 'text' -> Texto Normal , 'password' -> Senhas (vai ficar aquele bagulhinho escondido :) ) , 'email' -> Vai verificar o @ 
    inputId: string;
}


function InputForm({ placeholderText, labelTitle, typeInput, inputId }: InputFormProps) {
    const [show, setShow] = useState(false);

    const changeMode = () => {
        setShow(!show);
    };

    return (
        <form className="form-style">
            <label className="label-style">{labelTitle}</label> <br />
            <div className="input-group">
                <input id={inputId} type={show ? 'text' : typeInput} placeholder={placeholderText} size={30} maxLength={30} className="input-style" />
                {typeInput == 'password' &&
                    <button className="button-style" type="button" onMouseDown={changeMode} onMouseUp={changeMode} >
                        {show ? <VscEye /> : <VscEyeClosed />}
                    </button>
                }
            </div>
        </form>
    );
};


export default InputForm;