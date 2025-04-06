import * as z from "zod";

export const tripSchema = z.object({
  weight_unit: z.enum(["g", "lb", "kg", "mt"]),
  weight_value: z.number().positive(),
  distance_unit: z.enum(["mi", "km"]),
  distance_value: z.number().positive(),
});
