-- CreateTable
CREATE TABLE "houseDetails" (
    "uuid" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "postcalCode" TEXT NOT NULL,
    "floor_area" INTEGER NOT NULL,
    "room_count" INTEGER,
    "availability_status" TEXT NOT NULL,
    "latitude" INTEGER NOT NULL,
    "longitude" INTEGER NOT NULL,
    "image" VARCHAR(100) NOT NULL,
    "url" VARCHAR(100) NOT NULL,

    CONSTRAINT "houseDetails_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "rental_houses" (
    "id" SERIAL NOT NULL,
    "house_id" TEXT NOT NULL,
    "price_monthly" DOUBLE PRECISION NOT NULL
);

-- CreateTable
CREATE TABLE "sales_houses" (
    "id" SERIAL NOT NULL,
    "house_id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL
);

-- CreateTable
CREATE TABLE "realEstate_agent" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "house_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "houseDetails_uuid_key" ON "houseDetails"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "rental_houses_id_key" ON "rental_houses"("id");

-- CreateIndex
CREATE UNIQUE INDEX "sales_houses_id_key" ON "sales_houses"("id");

-- CreateIndex
CREATE UNIQUE INDEX "realEstate_agent_id_key" ON "realEstate_agent"("id");
