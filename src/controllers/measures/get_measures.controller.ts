import { Request, Response } from "express";
import { listMeasuresService } from "../../services/measures/list_measures.service";
import { MeasureType } from "../../enums/measures.enum";

export const GetMeasuresController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customer_code } = req.params;
    const { measure_type } = req.query;

    if (!customer_code) {
      res.status(400).json({
        error_code: 'INVALID_DTA',
        error_description: 'customer_code é obrigatório',
      });
      return;
    }

    if (measure_type && measure_type !== MeasureType.WATER && measure_type !== MeasureType.GAS) {
      res.status(400).json({
        error_code: 'INVALID_TYPE',
        error_description: 'Tipo de medição não permitida',
      });
      return;
    }

    const results = await listMeasuresService(customer_code, measure_type as MeasureType | undefined);

    res.status(200).json(results);
  } catch (err: any) {
    if (err.status === 404) {
      res.status(404).json({
        error_code: err.error_code,
        error_description: err.error_description,
      });
      return;
    }

    res.status(500).json({
      error_code: 'INTERNAL_SERVER_ERROR',
      error_description: 'Erro interno do servidor'
    });
  }
};
