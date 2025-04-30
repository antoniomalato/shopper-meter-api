import prisma from '../database/prisma';
import { UploadMeasureDTO } from '../schemas/measure.schema';
import { v4 as uuidv4 } from 'uuid';

export async function createMeasure(data: UploadMeasureDTO) {
  const { customer_code, measure_datetime, measure_type, image } = data;

  const startOfMonth = new Date(measure_datetime.getFullYear(), measure_datetime.getMonth(), 1);
  const endOfMonth = new Date(measure_datetime.getFullYear(), measure_datetime.getMonth() + 1, 0);

  const existing = await prisma.measure.findFirst({
    where: {
      customerCode: customer_code,
      measureType: measure_type,
      measureDatetime: {
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


  const mockValue = Math.floor(Math.random() * 10000);
  const mockImageUrl = `https://fakehost.com/images/${uuidv4()}`;

  const newMeasure = await prisma.measure.create({
    data: {
      customerCode: customer_code,
      measureDatetime: measure_datetime,
      measureType: measure_type,
      measureValue: mockValue,
      imageUrl: mockImageUrl,
    },
  });

  return {
    image_url: newMeasure.imageUrl,
    measure_value: newMeasure.measureValue,
    measure_uuid: newMeasure.id,
  };
}
