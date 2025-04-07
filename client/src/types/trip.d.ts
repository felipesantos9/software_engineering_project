type WeightUnit = 'g' | 'lb' | 'kg' | 'mt';
type DistanceUnit = 'mi' | 'km';
type TransportMethod = "ship" | "train" | 'truck' | "plane"

interface TripInterface {  
  weight_value: number;
  weight_unit: WeightUnit;
  distance_value: number;
  distance_unit: DistanceUnit;
  transport_method: TransportMethod;
}
