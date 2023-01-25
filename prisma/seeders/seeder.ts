const houses = require("./houseDetails.json");
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seedDB() {
  const houseDataBase = await prisma.houseDetails.createMany({
    data: houses,
  });
}
