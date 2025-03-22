import "./buttonInitialStyle.css"

interface ButtonInitialProps {
    content: string;
    // onSubmitFunction: () => void; 
}


function ButtonInitial ({content } : ButtonInitialProps) {
    return(
        <button className="button-initial-style" type="submit">
            {content}
        </button>
    );
};

export default ButtonInitial;