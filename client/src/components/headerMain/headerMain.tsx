// Componente que será o Header das páginas principais do sistema 
import Logo from "../logo/logo";
import "./headerMainStyle.css";
import { useNavigate } from "react-router";
import Dropdown from 'react-bootstrap/Dropdown';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface ButtonOptionProps {
    content: string;
    path: string;
};

function ButtonOption ({content, path}: ButtonOptionProps) {
    const navigate = useNavigate();
    
    const navigateFunc = (path:string) => {
        console.log(path);
        navigate(path);
    };
    return(
        <button className="button-option-style" onClick={() => navigateFunc(path)}>
            {content}
        </button>
    );
};


function HeaderMain() {
    return(
        <header className="headerMain-style">
            <div className="headerMain-logo">
                <Logo/>
            </div>

            <div className="headerMain-center-options">                
                
                <ButtonOption
                content="Início"
                path="/login"/>

                <ButtonOption
                content="Dashboard"
                path="/"/>

                <ButtonOption
                content="Relatório"
                path="/"/>

                <ButtonOption
                content="Registrar Dados"
                path="/"/>
                                                                
            </div>
            
            <div>                
            <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="headerMain-company-title">
          Empresa ABC
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className="headerMain-company-title-border">
        <DropdownMenu.Item
          className="headerMain-company-title-item">
          Sair
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
            </div>
        </header>
    );
};

export default HeaderMain;