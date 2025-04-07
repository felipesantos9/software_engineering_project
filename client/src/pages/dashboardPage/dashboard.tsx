import { useState } from "react";
import HeaderMain from "../../components/headerMain/headerMain";
import "./dashboardPageStyle.css";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

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

  const pieData = [
    { name: "Transporte", value: 400 },
    { name: "Energia", value: 300 },
    { name: "Resíduos", value: 300 },
    { name: "Outros", value: 200 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const lineData = [
    { name: "Jan", value: 400 },
    { name: "Fev", value: 300 },
    { name: "Mar", value: 500 },
    { name: "Abr", value: 200 },
    { name: "Mai", value: 278 },
    { name: "Jun", value: 189 },
  ];

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
            <div>
              <h3>Emissões por método</h3>
              <PieChart width={400} height={300}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </div>
            <div>
              <h3>Emissões por período</h3>
              <LineChart width={500} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
