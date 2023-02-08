/*
  Warnings:

  - You are about to drop the `houseDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `realEstate_agent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rental_houses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sales_houses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "houseDetails";

-- DropTable
DROP TABLE "realEstate_agent";

-- DropTable
DROP TABLE "rental_houses";

-- DropTable
DROP TABLE "sales_houses";

-- CreateTable
CREATE TABLE "HouseDetails" (
    "uuid" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "postcalCode" TEXT NOT NULL,
    "floorArea" INTEGER,
    "roomCount" INTEGER,
    "availabilityStatus" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "image" VARCHAR(300),
    "url" VARCHAR(300) NOT NULL,
    "realEstateAgentID" INTEGER NOT NULL,

    CONSTRAINT "HouseDetails_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "RentalHouse" (
    "houseId" TEXT NOT NULL,
    "priceMonthly" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "RentalHouse_pkey" PRIMARY KEY ("houseId")
);

-- CreateTable
CREATE TABLE "SalesHouse" (
    "houseId" TEXT NOT NULL,
    "askingPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SalesHouse_pkey" PRIMARY KEY ("houseId")
);

-- CreateTable
CREATE TABLE "RealEstateAgent" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "RealEstateAgent_id_key" ON "RealEstateAgent"("id");

-- AddForeignKey
ALTER TABLE "HouseDetails" ADD CONSTRAINT "HouseDetails_realEstateAgentID_fkey" FOREIGN KEY ("realEstateAgentID") REFERENCES "RealEstateAgent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalHouse" ADD CONSTRAINT "RentalHouse_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "HouseDetails"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesHouse" ADD CONSTRAINT "SalesHouse_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "HouseDetails"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
