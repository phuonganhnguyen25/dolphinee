/*
  Warnings:

  - You are about to drop the `City` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `District` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ward` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "LOCATION_TARGET" AS ENUM ('CITY', 'DISTRICT', 'WARD');

-- DropForeignKey
ALTER TABLE "District" DROP CONSTRAINT "District_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "Ward" DROP CONSTRAINT "Ward_parent_id_fkey";

-- DropTable
DROP TABLE "City";

-- DropTable
DROP TABLE "District";

-- DropTable
DROP TABLE "Ward";

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "target" "LOCATION_TARGET" NOT NULL DEFAULT 'CITY',
    "parent_id" INTEGER,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;
