import { FaCheckCircle } from "react-icons/fa";
import { IconContext } from "react-icons"; 
import "./confirmIconStyle.css";


function ConfirmIcon () {
    return(
        <IconContext.Provider value={{'className': 'confirmIcon'}}>
            <FaCheckCircle />
        </IconContext.Provider>
    );
};

export default ConfirmIcon;