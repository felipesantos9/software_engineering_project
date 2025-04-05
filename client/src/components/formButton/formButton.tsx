import "./formButtonStyle.css"

interface FormButtonProps {
    content: string;
    darkGreen: boolean;
    // onSubmitFunction: () => void; 
}


function FormButton ({content, darkGreen } : FormButtonProps) {
    return(
        <button className={`button-initial-style ${darkGreen ? "darkGreen-bg": "green-bg"}`}
                type="submit"
                >
            {content}
        </button>
    );
};

export default FormButton;