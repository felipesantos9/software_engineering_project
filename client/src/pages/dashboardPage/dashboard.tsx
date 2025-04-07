import { useState } from "react";
import HeaderMain from "../../components/headerMain/headerMain";
import "./dashboardPageStyle.css";

interface InfoProps {
  title: string;
  value: string;
}

export default function DashboardPage() {
  const [button, setButton] = useState<"yearly" | "monthly">("yearly");
  const Info = (info: InfoProps) => {
    return (
      <div className="container-info">
        <h3>{info.title}</h3>
        <p>{info.value}</p>
      </div>
    );
  };

  return (
    <>
      <HeaderMain />
      <div className="container">
        <div className="group-header">
          <div>
            <h2 className="title">Dashboard</h2>
            <p className="description">
              Monitore e analise sua pegada de carbono
            </p>
          </div>
          <div className="buttons-and-search">
            <div>
              <div className="buttons-last">
                <button
                  className={button == "monthly" ? "selected" : ""}
                  onClick={() => setButton("monthly")}
                >
                  Últimos 30 dias
                </button>
                <button
                  className={button == "yearly" ? "selected" : ""}
                  onClick={() => setButton("yearly")}
                >
                  Último ano
                </button>
              </div>
            </div>
            <form action="" className="search">
              <input type="date" placeholder="dd/mm/aaaa" />
              <span>Até</span>
              <input type="date" placeholder="dd/mm/aaaa" />
              <button>Aplicar</button>
            </form>
          </div>
          <div className="infos">
            <Info title="Emissões totais" value="93.920 tCO2" />
            <Info title="Intensidade de Carbono" value="0.536 kg CO2 / km" />
            <Info title="Média de emissão por rota" value="245 CO2" />
            <Info title="Rotas com nivéis acima do recomendado" value="21" />
          </div>
          <div className="graphs">
            <div>a</div>
            <div>a</div>
          </div>
        </div>
      </div>
    </>
  );
}
