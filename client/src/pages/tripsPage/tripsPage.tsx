import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import useUser from '../../hooks/useUser';
import HeaderMain from '../../components/headerMain/headerMain';
import './tripsPageStyle.css';
import * as Dialog from '@radix-ui/react-dialog';
import { getTrips } from '../../services/api/tripsRequest'; // Importa o serviço para buscar viagens
import TripsRegisterModal from '../../components/tripsRegisterModal/tripsRegisterModal';

type WeightUnit = 'g' | 'lb' | 'kg' | 'mt';
type DistanceUnit = 'mi' | 'km';

interface TripData {
  id: number;
  transportMethod: TransportMethod;
  distanceValue: string;
  weightValue: string;
  carbon: string;
  date: Date;
}

function TripsPage() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [trips, setTrips] = useState<TripData[]>([]); // Estado para armazenar as viagens
  const [filters, setFilters] = useState<TransportMethod[]>([]);
  const [tripsFiltered, setFilteredTrips] = useState<TripData[] | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof TripData; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    if (!user.auth) {
      navigate('/login');
    } else {
      fetchTrips(); // Busca as viagens ao carregar a página
    }
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await getTrips(user.token!); // Chama o serviço para buscar as viagens
      const formattedTrips = response.map((trip: any) => ({
        id: trip.id,
        transportMethod: trip.transport_method,
        distanceValue: `${trip.distance_value} ${trip.distance_unit}`,
        weightValue: `${trip.weight_value} ${trip.weight_unit}`,
        carbon: `${trip.carbon_kg} kg`,
        date: new Date(trip.created_at),
      }));
      setTrips(formattedTrips);
    } catch (error) {
      console.error('Erro ao buscar viagens:', error);
    }
  };

  const convertToKm = (distance: string): number => {
    const [value, unit] = distance.split(' ') as [string, DistanceUnit];
    const numericValue = parseFloat(value);
    return unit === 'km' ? numericValue : numericValue * 1.60934; // Conversão manual para km
  };

  const convertToKg = (weight: string): number => {
    weight = weight.replace(' CO2', '');
    const [value, unit] = weight.split(' ') as [string, WeightUnit];
    const numericValue = parseFloat(value);
    if (unit === 'lb') {
      return numericValue * 0.453592;
    }
    if (unit === 'mt') {
      return numericValue * 1000;
    }
    return numericValue;
  };

  const sortedTrips = (tripsFiltered ?? trips).slice().sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;

    let aValue = a[key];
    let bValue = b[key];

    if (key === 'distanceValue') {
      aValue = convertToKm(a.distanceValue);
      bValue = convertToKm(b.distanceValue);
    } else if (key === 'weightValue') {
      aValue = convertToKg(a.weightValue);
      bValue = convertToKg(b.weightValue);
    } else if (key === 'carbon') {
      aValue = convertToKg(a.carbon);
      bValue = convertToKg(b.carbon);
    }

    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof TripData) => {
    setSortConfig((prevConfig) => {
      if (prevConfig?.key === key) {
        return { key, direction: prevConfig.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const clearFilter = () => {
    setFilteredTrips(null);
    setFilters([]);
    const checkboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"][name="transportMethod"]');
    checkboxes.forEach((checkbox) => (checkbox.checked = false));
  };

  const keys: Record<string, TransportMethod> = {
    Avião: 'plane',
    Caminhão: 'truck',
    Trem: 'train',
    Navio: 'ship',
  };
  const keysMethods: Record<TransportMethod, string> = {
    plane: 'Avião',
    truck: 'Caminhão',
    train: 'Trem',
    ship: 'Navio',
  };

  const changeFilter = (element: HTMLInputElement) => {
    const { checked, value } = element;
    if (checked) filters.push(keys[value]);
    else filters.splice(filters.indexOf(keys[value]), 1);

    if (filters.length === 0) {
      setFilteredTrips(null);
      return;
    }
    const filtered = trips.filter((trip) => filters.includes(trip.transportMethod));
    setFilteredTrips(filtered.length > 0 ? filtered : null);
  };

  return (
    <Dialog.Root>
      <HeaderMain />
      <TripsRegisterModal/>
      <div className="container">
        <div className="group-header">
          <div>
            <h2 className="title">Registro de viagens</h2>
            <p className="description">Insira informações sobre suas emissões de carbono.</p>
          </div>
          <div>

            <Dialog.Trigger asChild>
              <button>Registrar nova viagem</button>
            </Dialog.Trigger>
          </div>
        </div>
        <div className="trip-list">
          <div className="group-header">
            <div>
              <h3 className="title">Todas as viagens</h3>
              <p className="description">Registre as viagens de transporte de cargas</p>
            </div>
            <div className="filter-group">
              <p>Meio de transporte:</p>
              <label>
                <input type="checkbox" name="transportMethod" onChange={(event) => changeFilter(event.target)} value="Avião" />
                Avião
              </label>
              <label>
                <input type="checkbox" name="transportMethod" onChange={(event) => changeFilter(event.target)} value="Trem" />
                Trem
              </label>
              <label>
                <input type="checkbox" name="transportMethod" onChange={(event) => changeFilter(event.target)} value="Caminhão" />
                Caminhão
              </label>
              <label>
                <input type="checkbox" name="transportMethod" onChange={(event) => changeFilter(event.target)} value="Navio" />
                Navio
              </label>
              <button className="reset-button" onClick={clearFilter}>
                Limpar
              </button>
            </div>
          </div>
          <table className="trips-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('id')}>ID</th>
                <th onClick={() => handleSort('transportMethod')}>Meio de transporte</th>
                <th onClick={() => handleSort('date')}>Data</th>
                <th onClick={() => handleSort('distanceValue')}>Distância total</th>
                <th onClick={() => handleSort('weightValue')}>Peso total</th>
                <th onClick={() => handleSort('carbon')}>Emissão de carbono</th>
              </tr>
            </thead>
            <tbody>
              {sortedTrips.map((trip) => (
                <tr key={trip.id}>
                  <td>{trip.id}</td>
                  <td>{keysMethods[trip.transportMethod]}</td>
                  <td>{new Date(trip.date).toLocaleDateString('pt-BR')}</td>
                  <td>{trip.distanceValue}</td>
                  <td>{trip.weightValue}</td>
                  <td>{trip.carbon}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Dialog.Root>
  );
}

export default TripsPage;

