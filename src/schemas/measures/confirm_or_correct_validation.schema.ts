import { z } from 'zod';

export const confirmOrCorrectMeasureSchema = z.object({
  measure_uuid: z.string().uuid(),
  confirmed_value: z.number().int().positive(),
});

export type ConfirmOrCorrectMeasureSchemaType = z.infer<typeof confirmOrCorrectMeasureSchema>;
