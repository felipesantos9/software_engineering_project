type WeightUnit = 'g' | 'lb' | 'kg' | 'mt';
type DistanceUnit = 'mi' | 'km';
type TransportMethod = "ship" | "train" | 'truck' | "plane"

interface TripInterface {
  weight_unit: WeightUnit;
  weight_value: number;
  distance_unit: DistanceUnit;
  distance_value: number;
  transport_method: TransportMethod;
}
