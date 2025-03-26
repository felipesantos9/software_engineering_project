import "./formButtonStyle.css"

interface FormButtonProps {
    content: string;
    // onSubmitFunction: () => void; 
}


function FormButton ({content } : FormButtonProps) {
    return(
        <button className="button-initial-style" type="submit">
            {content}
        </button>
    );
};

export default FormButton;