import "./inputFormStyle.css";


function InputForm() {
    return(
        <form className="form-style">
        <label className="label-style">Parâmetro de título da Label</label> <br/> <br/>
        <input type="text" placeholder="teste" size={30} maxLength={30} className="input-style"/>        
        </form>
    );
};

export default InputForm;