-- DropIndex
DROP INDEX "houseDetails_uuid_key";

-- AlterTable
ALTER TABLE "houseDetails" ADD CONSTRAINT "houseDetails_pkey" PRIMARY KEY ("uuid");
