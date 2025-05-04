import { confirmOrCorrectMeasureSchema } from '../../schemas/measures/confirm_or_correct_validation.schema';
import { confirmOrCorrectMeasureService } from '../../services/measures/confirm_or_correct_measure.service';
import { Request, Response } from 'express';

export const PatchConfirmOrCorrectMeasureController = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = confirmOrCorrectMeasureSchema.parse(req.body);
    const result = await confirmOrCorrectMeasureService(parsed);
    res.status(200).json(result);
  } catch (err: any) {
    const errorResponses: Record<string, () => void> = {
      '404': () => res.status(404).json({
        error_code: 'MEASURE_NOT_FOUND',
        error_description: 'Leitura não encontrada'
      }),
      
      '409': () => res.status(409).json({
        error_code: 'CONFIRMATION_DUPLICATE',
        error_description: 'Leitura já confirmada'
      }),
      
      'ZodError': () => res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: err.errors.map((e: any) => e.message).join(', ')
      })
    };

    const errorHandler = err.status ? errorResponses[err.status] : errorResponses[err.name];
    errorHandler ? errorHandler() : res.status(500).json({ error: 'Internal server error' });
  }
};
