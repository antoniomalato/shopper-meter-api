import { z } from 'zod';

export const uploadMeasureSchema = z.object({
  image: z.string().refine((val) => val.startsWith('data:image/'), {
    message: 'Invalid base64 image',
  }),
  customer_code: z.string().min(1),
  measure_datetime: z.coerce.date(),
  measure_type: z.enum(['WATER', 'GAS']),
});

export type UploadMeasureDTO = z.infer<typeof uploadMeasureSchema>;
