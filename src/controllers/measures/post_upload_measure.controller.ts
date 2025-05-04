import { Request, Response } from 'express';
import { createMeasureService } from '../../services/measures/create_measure.service';
import { uploadMeasureValidationSchema } from '../../schemas/measures/upload_measure_validation.schema';

export const PostUploadMeasureController = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = uploadMeasureValidationSchema.parse(req.body);
    const result = await createMeasureService(parsed);

    res.status(200).json(result);
  } catch (err: any) {
    if (err.status === 409) {
      res.status(409).json({
        error_code: err.error_code,
        error_description: err.error_description,
      });
      return;
    }

    if (err.name === 'ZodError') {
      res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: err.errors.map((e: any) => e.message).join(', '),
      });
      return;
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};