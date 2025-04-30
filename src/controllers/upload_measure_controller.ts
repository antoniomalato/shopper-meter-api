import { Request, Response } from 'express';
import { uploadMeasureSchema } from '../schemas/measure.schema';
import { createMeasure } from '../services/measure.service';

export const UploadMeasure = async (req: Request, res: Response) => {
  try {
    const parsed = uploadMeasureSchema.parse(req.body);
    const result = await createMeasure(parsed);

    return res.status(200).json(result);
  } catch (err: any) {
    if (err.status === 409) {
      return res.status(409).json({
        error_code: err.error_code,
        error_description: err.error_description,
      });
    }

    if (err.name === 'ZodError') {
      return res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: err.errors.map((e: any) => e.message).join(', '),
      });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
};
