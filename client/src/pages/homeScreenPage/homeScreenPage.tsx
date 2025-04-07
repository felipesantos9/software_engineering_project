import Logo from "../../components/logo/logo";
import { LuUpload, LuChartPie, LuClipboard } from "react-icons/lu";
import { IconContext, IconBaseProps } from "react-icons";
import { FC } from "react";
import { useNavigate } from 'react-router-dom';
import "./homeScreenPageStyle.css";


interface ItemProps {
    title: string;
    description: string;
    icon: FC<IconBaseProps>;
}
  
function Item({ title, description, icon: Icon }: ItemProps) {
    return (
        <div className="item">
            <IconContext.Provider value={{ className: 'item-icon' }}>
                <Icon />
            </IconContext.Provider>

            <h3 className="item-title">
                {title}
            </h3>

            <p className="item-description">
                {description}
            </p>
        </div>
    );
}


function HomeScreenPage() {
    const navigate = useNavigate();

    function navigateFunc (page: string) {
        const path = '/' + page;
        navigate(path);
    };

    return(
        <main className="main-style">
            <header className="header-style">
                <div className="logo-header">
                    <Logo/>
                </div>
                
                <div className="buttons-header">
                    <button className="enter-button" onClick={() => navigateFunc('login')}>
                        Entrar
                    </button>

                    <button className="register-button" onClick={() => navigateFunc('register')}>
                        Registrar
                    </button>

                </div>
            </header>
            
            <div className="intermediate-content">

                <div className="intermediate-content-left">                    
                    <h1 className="intermediate-content-left-title">
                        Monitore sua pegada de carbono empresarial
                    </h1>
                    <p className="intermediate-content-left-description">
                        Transforme dados em ações sustentáveis com nossa plataforma intuitiva de monitoramento ambiental. 
                    </p>
                    <button className="intermediate-content-left-button" onClick={() => navigateFunc('login')}>
                        Começar agora →
                    </button>
                </div>

                <div>
                    <img src="https://img.freepik.com/free-photo/delivery-robot-futuristic-environment_23-2151189210.jpg?t=st=1743895897~exp=1743899497~hmac=1885e1346dfa7b3c5d05b13f8c401a1e04c10ac05f07804ceb76ec6b25f99529&w=996" className="intermediate-content-right-image"/>                    
                </div>

            </div>

            <div className="final-content">
                <div className="final-content-label">
                    <h1 className="final-content-title">
                        Recursos Principais
                    </h1>

                    <p className="final-content-description">
                        Nossa plataforma oferece ferramentas completas para monitorar, analisar e reduzir sua pegada de carbono.
                    </p>
                </div>

                <div className="final-content-items">                    
                    <Item
                    title="Entrada de dados"
                    description="Formulários intuitivos para registrar consumo de energia, transporte, resíduos e outras fontes de emissão"
                    icon={LuUpload}/>

                    <Item
                    title="Dashboards"
                    description="Visualize tendências, compare períodos e identifque oportunidades de redução com gráficos interativos"
                    icon={LuChartPie}/>

                    <Item
                    title="Relatórios"
                    description="Gere relatórios personalizados para compartilhar com stakeholders"
                    icon={LuClipboard}/>
                    
                </div>
            </div>
        </main>
    );
};

export default HomeScreenPage;