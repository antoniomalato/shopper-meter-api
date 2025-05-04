import prisma from "../../database/prisma";
import { ConfirmOrCorrectMeasureSchemaType } from "../../schemas/measures/confirm_or_correct_validation.schema";

export async function confirmOrCorrectMeasureService(data: ConfirmOrCorrectMeasureSchemaType) {
  const { measure_uuid, confirmed_value } = data;

  const measure = await prisma.measure.findUnique({
    where: { id: measure_uuid },
  });

  if (!measure) {
    throw {
      status: 404,
      error_code: 'MEASURE_NOT_FOUND',
      error_description: 'Leitura não encontrada',
    };
  }

  if (measure.has_confirmed) {
    throw {
      status: 409,
      error_code: 'CONFIRMATION_DUPLICATE',
      error_description: 'Leitura já confirmada',
    };
  }

  await prisma.measure.update({
    where: { id: measure_uuid },
    data: {
      measure_value: confirmed_value,
      has_confirmed: true,
      confirmed_at: new Date()
    },
  });

  return { success: true };
}
