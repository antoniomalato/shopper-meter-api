import prisma from "../../database/prisma";
import { MeasureType } from "../../enums/measures.enum";
import { Measure } from "@prisma/client";


export async function checkDuplicateMeasure(
  customerCode: string,
  measureType: MeasureType,
  measureDatetime: Date
): Promise<boolean> {
  const measureYear = measureDatetime.getFullYear();
  const measureMonth = measureDatetime.getMonth();

  const existingMeasures = await prisma.measure.findMany({
    where: {
      customer_code: customerCode,
      measure_type: measureType,
    },
  });

  const duplicateMeasure = existingMeasures.find((measure: Measure) => {
    const existingYear = measure.measure_datetime.getFullYear();
    const existingMonth = measure.measure_datetime.getMonth();
    return existingYear === measureYear && existingMonth === measureMonth;
  });

  return !!duplicateMeasure;
}