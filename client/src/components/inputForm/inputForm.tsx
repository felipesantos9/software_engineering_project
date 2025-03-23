import "./inputFormStyle.css";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { useState } from "react";

interface InputFormProps {
    placeholderText: string;
    labelTitle: string;
    typeInput: 'text' | 'password' | 'email'; // 'text' -> Texto Normal , 'password' -> Senhas (vai ficar aquele bagulhinho escondido :) ) , 'email' -> Vai verificar o @ 
    inputId: string;
    register: any;
}


function InputForm({ placeholderText, labelTitle, typeInput, inputId, register }: InputFormProps) {
    const [show, setShow] = useState(false);

    const changeMode = () => {
        setShow(!show);
    };

    return (
        <div className="input-container-style">
            <label className="label-style">{labelTitle}</label> <br />
            <div className="input-group">
                <input id={inputId} type={show ? 'text' : typeInput} placeholder={placeholderText} size={30} maxLength={30} className="input-style" required  {...register(inputId.toString())}/>
                {typeInput == 'password' &&
                    <button className="button-style" type="button" onMouseDown={changeMode} onMouseUp={changeMode} >
                        {show ? <VscEye size={20}/> : <VscEyeClosed size={20}/>}
                    </button>
                }
            </div>
        </div>
    );
};


export default InputForm;