import { FaTruck } from "react-icons/fa6";
import { IconContext } from "react-icons"; // Vai servir para fazer as config de CSS
import "./companyIconStyle.css";

function CompanyIcon () {
    return(
        <div className="login-icon-container">
            <IconContext.Provider value={{'className': 'login-icon'}}>
                    <FaTruck/>
            </IconContext.Provider>
        </div>
    );
};

export default CompanyIcon;