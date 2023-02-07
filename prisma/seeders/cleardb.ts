import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function clearDB() {
  const clearRentalDB = await prisma.rentalHouse.deleteMany({
    where: {},
  });
  const clearSalesDB = await prisma.salesHouse.deleteMany({
    where: {},
  });

  const clearHouses = await prisma.houseDetails.deleteMany({
    where: {},
  });
  const clearRealEstateDB = await prisma.realEstateAgent.deleteMany({
    where: {},
  });
}

clearDB();
