const houses: Array<THouseObject> = require("/Users/karin/Code/amsterdamHousing/houseDetails.json");
import dotenv from "dotenv";
dotenv.config();
import {
  HouseDetails,
  PrismaClient,
  RentalHouse,
  SalesHouse,
} from "@prisma/client";
const prisma = new PrismaClient();
import { THouseObject, TRealEstateAgent } from "../../src/entities";

export function createRealEstateArray(
  houses: Array<THouseObject>
): Array<TRealEstateAgent> {
  const realEstateArray: Array<TRealEstateAgent> = [];
  for (let index = 0; index < houses.length; index++) {
    const house: THouseObject = houses[index];
    const realEstateObject = { name: house.realEstate };
    realEstateArray.push(realEstateObject as TRealEstateAgent);
  }

  return removeDuplicates(realEstateArray);
}

export function createHouseArray(
  houses: Array<THouseObject>,
  getRealEstates: Array<TRealEstateAgent>
): Array<HouseDetails> {
  const houseArray: Array<HouseDetails> = [];

  for (let index = 0; index < houses.length; index++) {
    const house: THouseObject = houses[index];
    const estatesFind = getRealEstates.find((realEstate) => {
      if (realEstate.name === house.realEstate) {
        return realEstate;
      }
    });
    const houseObject: HouseDetails = {
      uuid: house.uuid as string,
      address: house.address as string,
      postcalCode: house.postalCode as string,
      floorArea: house.floorArea as number | null,
      roomCount: house.roomCount as number | null,
      availabilityStatus: house.availabilityStatus as string,
      latitude: house.latitude as number,
      longitude: house.longitude as number,
      image: house.image as string,
      url: house.url as string,
      realEstateAgentID: estatesFind?.id as number,
    };
    houseArray.push(houseObject);
  }

  return houseArray;
}

export function createSalesArray(
  houses: Array<THouseObject>
): Array<SalesHouse> {
  const salesArray: Array<SalesHouse> = [];
  for (let index = 0; index < houses.length; index++) {
    const house: THouseObject = houses[index];
    if (house.forSale === true && house.askingPrice !== null) {
      const salesObject: SalesHouse = {
        houseId: house.uuid as string,
        askingPrice: house.askingPrice as number,
      };
      salesArray.push(salesObject);
    }
  }
  return salesArray;
}

export function createRentalArray(
  houses: Array<THouseObject>
): Array<RentalHouse> {
  const rentalArray: Array<RentalHouse> = [];
  for (let index = 0; index < houses.length; index++) {
    const house: THouseObject = houses[index];
    if (house.forSale === false) {
      const rentalObject = {
        houseId: house.uuid,
        priceMonthly: house.rentalPrice,
      };
      rentalArray.push(rentalObject as RentalHouse);
    }
  }
  return rentalArray;
}

export function removeDuplicates(
  array: Array<TRealEstateAgent>
): Array<TRealEstateAgent> {
  const seen = new Set();
  const removedDuplicates = array.filter((agent) => {
    const duplicate = seen.has(agent.name);
    seen.add(agent.name);
    return !duplicate;
  });

  return removedDuplicates;
}

async function seedDB() {
  const realEstateDataBase = await prisma.realEstateAgent.createMany({
    data: createRealEstateArray(houses),
  });

  const getRealEstates = await prisma.realEstateAgent.findMany({
    where: {},
  });

  const houseDataBase = await prisma.houseDetails.createMany({
    data: createHouseArray(houses, getRealEstates),
  });

  const salesDataBase = await prisma.salesHouse.createMany({
    data: createSalesArray(houses),
  });

  const rentalDataBase = await prisma.rentalHouse.createMany({
    data: createRentalArray(houses),
  });
}

seedDB()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
