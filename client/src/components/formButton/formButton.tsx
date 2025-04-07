import "./formButtonStyle.css"

interface FormButtonProps {
    content: string;
    darkGreen: boolean;
    isDisabled: boolean;
    // onSubmitFunction: () => void; 
}


function FormButton({ content, darkGreen, isDisabled }: FormButtonProps) {
    return (
        <button className={`button-initial-style ${darkGreen ? "darkGreen-bg" : "green-bg"}`}
            type="submit"
            disabled={isDisabled}
        >
            {content}
        </button>
    );
};

export default FormButton;