import { useState, useEffect } from "react";
import HeaderMain from "../../components/headerMain/headerMain";
import "./dashboardPageStyle.css";
import useUser from "../../hooks/useUser";
import { getEstimates, getReport } from "../../services/api/tripsRequest"; // Importa o serviço getReport
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
  const { user } = useUser();

  // Estados para armazenar os dados da API
  const [totalEmissions, setTotalEmissions] = useState<string>("Carregando...");
  const [carbonIntensity, setCarbonIntensity] = useState<string>("Carregando...");
  const [averageEmissionPerRoute, setAverageEmissionPerRoute] = useState<string>("Carregando...");
  const [emissionsByTransport, setEmissionsByTransport] = useState<any[]>([]);
  const [dailyEmissions, setDailyEmissions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {

      try {
        const data = await getEstimates(user.token!, "9999-12-31", "1970-12-31");

        if (data) {
          setTotalEmissions(`${data.total_emissions_kg.toFixed(2)} kg`);
          setCarbonIntensity(`${data.avg_carbon_intensity.toFixed(2)} kg/km`);
          setAverageEmissionPerRoute(`${data.avg_emission_per_route.toFixed(2)} kg`);

          // Formata os dados para o gráfico de pizza
          const transportData = Object.entries(data.emissions_by_transport_method).map(
            ([method, value]) => ({
              name: method.charAt(0).toUpperCase() + method.slice(1), // Capitaliza o nome
              value,
            })
          );
          setEmissionsByTransport(transportData);

          // Formata os dados para o gráfico de linha
          const dailyData = Object.entries(data.daily_emissions).map(([date, value]) => ({
            name: new Date(date).toLocaleDateString("pt-BR"),
            value,
          }));
          setDailyEmissions(dailyData);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
        setTotalEmissions("Erro");
        setCarbonIntensity("Erro");
        setAverageEmissionPerRoute("Erro");
      }

    };

    fetchData();
  }, []);

  const handleGenerateReport = async () => {
    try {
      const response = await getReport(user.token!, "9999-12-31", "1970-12-31"); // Faz a requisição para o serviço getReport

      // Cria um link para download do PDF
      const blob = new Blob([response], { type: "application/pdf" });
      console.log(response)
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "relatorio_viagens.pdf";
      link.click();
      window.URL.revokeObjectURL(url); // Revoga o objeto URL após o download
    } catch (error) {
      console.error("Erro ao gerar o relatório:", error);
    }
  };

  const Info = (info: InfoProps) => {
    return (
      <div className="container-info">
        <h3>{info.title}</h3>
        <p>{info.value}</p>
      </div>
    );
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <>
      <HeaderMain />
      <div className="container">
        <div className="group-header">
          <div>
            <h2 className="title">Dashboard</h2>
            <p className="description">Monitore e analise sua pegada de carbono</p>
          </div>
          <div>
            <button onClick={handleGenerateReport}>Gerar relatório</button>
          </div>
        </div>
        <div className="infos">
          <Info title="Emissões totais" value={totalEmissions} />
          <Info title="Intensidade de Carbono" value={carbonIntensity} />
          <Info title="Média de emissão por rota" value={averageEmissionPerRoute} />
        </div>
        <div className="graphs">
          <div>
            <h3>Emissões por método</h3>
            <PieChart width={400} height={300}>
              <Pie
                data={emissionsByTransport}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {emissionsByTransport.map((entry, index) => (
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
            <LineChart width={500} height={300} data={dailyEmissions}>
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
    </>
  );
}
