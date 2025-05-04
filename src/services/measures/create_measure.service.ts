import { getMeasureFromImage } from '../../config/gemini';
import prisma from '../../database/prisma';
import { v4 as uuidv4 } from 'uuid';
import { UploadMeasureValidationSchemaType } from '../../schemas/measures/upload_measure_validation.schema';

export async function createMeasureService(data: UploadMeasureValidationSchemaType) {
  const { customer_code, measure_datetime, measure_type, image } = data;

  const startOfMonth = new Date(measure_datetime.getFullYear(), measure_datetime.getMonth(), 1);
  const endOfMonth = new Date(measure_datetime.getFullYear(), measure_datetime.getMonth() + 1, 0);

  const existing = await prisma
    .measure.findFirst({
      where: {
        customer_code: customer_code,
        measure_type: measure_type,
        measure_datetime: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

  if (existing) {
    throw {
      status: 409,
      error_code: 'DOUBLE_REPORT',
      error_description: 'Leitura do mês já realizada',
    };
  }

  const measureValue = await getMeasureFromImage(image);

  const newMeasure = await prisma.measure.create({
    data: {
      customer_code: customer_code,
      measure_datetime: measure_datetime,
      measure_type: measure_type,
      measure_value: measureValue,
      image_url: `http://localhost.com/images/${uuidv4()}`,
    },
  });

  return {
    image_url: newMeasure.image_url,
    measure_value: newMeasure.measure_value,
    measure_uuid: newMeasure.id,
  };
}
