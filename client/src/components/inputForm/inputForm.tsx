import "./inputFormStyle.css";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { useState } from "react";
import { UseFormSetValue } from "react-hook-form";

interface InputFormProps {
    placeholderText: string;
    labelTitle: string;
    typeInput: 'text' | 'password' | 'email'; // 'text' -> Texto Normal , 'password' -> Senhas (vai ficar aquele bagulhinho escondido :) ) , 'email' -> Vai verificar o @ 
    inputId: string;
    register: any;
    setValue: UseFormSetValue<any>
}

function InputForm({ placeholderText, labelTitle, typeInput, inputId, register, setValue }: InputFormProps) {
    const [show, setShow] = useState(false);

    const changeMode = () => {
        setShow(!show);
    };

    let maxLenth = 255;

    switch (inputId) {
        case "cnpj":
            maxLenth = 18;
            break
        case "phonenumber":
            maxLenth = 15;
            break
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const maskInInput = (inputValue: any) => {
        inputValue = inputValue.target.value

        if (["phonenumber", "cnpj"].includes(inputId)) {

            inputValue = inputValue.replace(/\D/g, '')

            if (inputId == "phonenumber") {
                inputValue = inputValue.replace(/^(\d{2})(\d)/g, '($1) $2');
                inputValue = inputValue.replace(/(\d{5})(\d{1,4})/, '$1-$2');
            }

            if (inputId == "cnpj") {
                inputValue = inputValue.replace(/^(\d{2})(\d)/, '$1.$2');
                inputValue = inputValue.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                inputValue = inputValue.replace(/\.(\d{3})(\d)/, '.$1/$2');
                inputValue = inputValue.replace(/(\d{4})(\d)/, '$1-$2');
            }
        }

        setValue(inputId as 'text' | 'password' | 'email', inputValue)
    }

    return (
        <div className="input-container-style">
            <label className="label-style">{labelTitle}</label> <br />
            <div className="input-group">
                <input id={inputId} type={show ? 'text' : typeInput} placeholder={placeholderText} size={30} maxLength={maxLenth} className="input-style" required  {...register(inputId.toString())} onChangeCapture={maskInInput} />
                {typeInput == 'password' &&
                    <button className="button-style" type="button" onMouseDown={changeMode} onMouseUp={changeMode} >
                        {show ? <VscEye size={20} /> : <VscEyeClosed size={20} />}
                    </button>
                }
            </div>
        </div>
    );
};


export default InputForm;