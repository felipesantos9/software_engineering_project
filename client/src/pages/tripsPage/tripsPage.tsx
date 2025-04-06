import { useState } from 'react';
import UnitConverter from 'unit-converter'; // Biblioteca alternativa para conversão de unidades
import HeaderMain from '../../components/headerMain/headerMain';
import './tripsPageStyle.css';
import * as Dialog from '@radix-ui/react-dialog';
import TripsRegisterPage from '../../components/tripsRegisterModal/tripsRegisterModal';

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
  const [trips] = useState<TripData[]>([
    {
      id: 1,
      transportMethod: "truck",
      distanceValue: "500 km",
      weightValue: "11 mt",
      carbon: "150 kg CO2",
      date: new Date("2023-01-15")
    },
    {
      id: 2,
      transportMethod: "train",
      distanceValue: "1200 km",
      weightValue: "4000 lb",
      carbon: "300 kg CO2",
      date: new Date("2023-02-10")
    },
    {
      id: 3,
      transportMethod: "ship",
      distanceValue: "3000 km",
      weightValue: "2266.962 kg",
      carbon: "800 kg CO2",
      date: new Date("2023-03-05")
    },
    {
      id: 4,
      transportMethod: "plane",
      distanceValue: "1500 km",
      weightValue: "1000 kg",
      carbon: "1200 kg CO2",
      date: new Date("2023-04-20")
    }
  ]);

  const [filters, setFilters] = useState<TransportMethod[]>([]);

  const [tripsFiltered, setFilteredTrips] = useState<TripData[] | null>(null);

  const [sortConfig, setSortConfig] = useState<{ key: keyof TripData; direction: 'asc' | 'desc' } | null>(null);

  const convertToKm = (distance: string): number => {
    const [value, unit] = distance.split(' ') as [string, DistanceUnit];
    const numericValue = parseFloat(value);
    return unit === 'km'
      ? numericValue
      : UnitConverter(numericValue, unit).to('km');
  };

  const convertToKg = (weight: string): number => {
    weight = weight.replace(" CO2", "");
    const [value, unit] = weight.split(' ') as [string, WeightUnit];
    const numericValue = parseFloat(value);
    if (unit == 'lb') {
      return numericValue * 0.453592;
    }

    if (unit == 'mt') {
      return numericValue * 1000;
    }

    return unit === 'kg'
      ? numericValue
      : UnitConverter(numericValue, unit).to('kg');
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
    } else if (key == 'carbon') {
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

  const getSortIndicator = (key: keyof TripData) => {
    if (!sortConfig || sortConfig.key !== key) {
      return (
        <>
          <span style={{ opacity: 0.3 }}>▲</span>
          <span style={{ opacity: 0.3 }}>▼</span>
        </>
      );
    }
    return sortConfig.direction === 'asc' ? (
      <>
        <span style={{ fontWeight: 'bold' }}>▲</span>
        <span style={{ opacity: 0.3 }}>▼</span>
      </>
    ) : (
      <>
        <span style={{ opacity: 0.3 }}>▲</span>
        <span style={{ fontWeight: 'bold' }}>▼</span>
      </>
    );
  };

  const clearFilter = () => {
    setFilteredTrips(null);
    setFilters([]);
    const checkboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"][name="transportMethod"]');
    checkboxes.forEach((checkbox) => (checkbox.checked = false));
  };

  const keys: Record<string, TransportMethod> = {
    "Avião": "plane",
    "Caminhão": "truck",
    "Trem": "train",
    "Navio": "ship",
  };
  const keysMethods: Record<TransportMethod, string> = {
    plane: "Avião",
    truck: "Caminhão",
    train: "Trem",
    ship: "Navio",
  };

  const changeFilter = (element: HTMLInputElement) => {
    const { checked, value } = element;
    if (checked) filters.push(keys[value]);
    else filters.splice(filters.indexOf(keys[value]), 1);


    if (filters.length == 0) {
      setFilteredTrips(null);
      return;
    }
    const filtered = trips.filter((trip) => filters.includes(trip.transportMethod));
    setFilteredTrips(filtered.length > 0 ? filtered : null);
  };

  return (
    <Dialog.Root>
      <HeaderMain />
      <TripsRegisterPage />
      <div className='container'>
        <div className='group-header'>
          <div>
            <h2 className='title'>Registro de viagens</h2>
            <p className='description'>Insira informações sobre suas emissões de carbono.</p>
          </div>
          <div>
            <Dialog.Trigger asChild>
              <button>Registrar nova viagem</button>
            </Dialog.Trigger>
          </div>
        </div>
        <div className='trip-list'>
          <div className='group-header'>
            <div>
              <h3 className='title'>Todos os viagens</h3>
              <p className='description'>Registre as viagens de transporte de cargas</p>
            </div>
            <div className='filter-group'>
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
              <button className='reset-button' onClick={clearFilter}>
                Limpar
              </button>
            </div>
          </div>
          <table className="trips-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('id')}>ID {getSortIndicator('id')}</th>
                <th onClick={() => handleSort('transportMethod')}>Meio de transporte {getSortIndicator('transportMethod')}</th>
                <th onClick={() => handleSort('date')}>Data {getSortIndicator('date')}</th>
                <th onClick={() => handleSort('distanceValue')}>Distância total {getSortIndicator('distanceValue')}</th>
                <th onClick={() => handleSort('weightValue')}>Peso total {getSortIndicator('weightValue')}</th>
                <th onClick={() => handleSort('carbon')}>Emissão de carbono {getSortIndicator('carbon')}</th>
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

