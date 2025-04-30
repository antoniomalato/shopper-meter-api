-- CreateEnum
CREATE TYPE "MeasureType" AS ENUM ('WATER', 'GAS');

-- CreateTable
CREATE TABLE "measure" (
    "id" TEXT NOT NULL,
    "customer_code" TEXT NOT NULL,
    "measure_datetime" TIMESTAMP(3) NOT NULL,
    "measure_type" "MeasureType" NOT NULL,
    "measure_value" INTEGER,
    "image_url" TEXT NOT NULL,
    "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "measure_pkey" PRIMARY KEY ("id")
);
