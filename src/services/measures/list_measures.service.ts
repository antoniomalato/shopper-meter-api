import prisma from "../../database/prisma";
import { MeasureType } from "../../enums/measures.enum";

export async function listMeasuresService(customer_code: string, measure_type?: MeasureType) {
  const filters: any = {
    customer_code,
  };

  if (measure_type) {
    filters.measure_type = measure_type;
  }

  const measures = await prisma.measure.findMany({
    where: filters,
    orderBy: {
      measure_datetime: 'desc',
    },
  });

  if (measures.length === 0) {
    throw {
      status: 404,
      error_code: 'MEASURES_NOT_FOUND',
      error_description: 'Nenhuma leitura encontrada',
    };
  }

  return {
    customer_code,
    measures: measures.map((m) => ({
      measure_uuid: m.id,
      measure_datetime: m.measure_datetime,
      measure_type: m.measure_type,
      has_confirmed: m.has_confirmed,
      image_url: m.image_url,
    })),
  };
}
