/*
  Warnings:

  - The primary key for the `houseDetails` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "houseDetails" DROP CONSTRAINT "houseDetails_pkey";
