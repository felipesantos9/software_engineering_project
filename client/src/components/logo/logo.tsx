import { FaTruck } from "react-icons/fa6";
import { IconContext } from "react-icons"; // Vai servir para fazer as config de CSS
import "./logoStyle.css";

function Logo () {
    return(
        <div className="login-icon-container">
            <IconContext.Provider value={{'className': 'login-icon'}}>
                    <FaTruck/>
            </IconContext.Provider>
        </div>
    );
};

export default Logo;