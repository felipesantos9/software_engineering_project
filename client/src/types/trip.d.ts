type WeightUnit = 'g' | 'lb' | 'kg' | 'mt';
type DistanceUnit = 'mi' | 'km';

interface TripInterface {
  weight_unit: WeightUnit;
  weight_value: number;
  distance_unit: DistanceUnit;
  distance_value: number;
}
