-- DropForeignKey
ALTER TABLE "HouseDetails" DROP CONSTRAINT "HouseDetails_realEstateAgentID_fkey";

-- AlterTable
ALTER TABLE "HouseDetails" ALTER COLUMN "realEstateAgentID" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "HouseDetails" ADD CONSTRAINT "HouseDetails_realEstateAgentID_fkey" FOREIGN KEY ("realEstateAgentID") REFERENCES "RealEstateAgent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
