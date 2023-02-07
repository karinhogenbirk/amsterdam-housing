const houses: Array<THouseObject> = require("/Users/karin/Code/amsterdamHousing/houseDetails.json");
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type THouseObject = {
  uuid: string;
  address: string;
  postalCode: string;
  rentalPrice: number;
  askingPrice: number | null;
  floorArea?: number;
  roomCount?: number;
  availabilityStatus: string;
  realEstate: string;
  latitude: number;
  longitude: number;
  image?: string;
  url: string;
  forSale: boolean;
};

type TRealEstateAgent = {
  name: string;
  id?: number;
};

function createRealEstateArray() {
  const realEstateArray: Array<TRealEstateAgent> = [];
  for (let index = 0; index < houses.length; index++) {
    const house: THouseObject = houses[index];
    const realEstateObject = { name: house.realEstate };
    realEstateArray.push(realEstateObject);
  }

  return removeDuplicates(realEstateArray);
}

function removeDuplicates(array: Array<TRealEstateAgent>) {
  const removeDuplicates = array.filter((value, index) => {
    const _value: string = JSON.stringify(value);
    return (
      index ===
      array.findIndex((obj) => {
        return JSON.stringify(obj) === _value;
      })
    );
  });
  // console.log(removeDuplicates);
  return removeDuplicates;
}

async function seedDB() {
  const realEstateDataBase = await prisma.realEstateAgent.createMany({
    data: createRealEstateArray(),
  });

  const getRealEstates = await prisma.realEstateAgent.findMany({
    where: {},
  });

  for (let index = 0; index < houses.length; index++) {
    const house: THouseObject = houses[index];

    const estatesFind = getRealEstates.find((realEstate) => {
      if (realEstate.name === house.realEstate) {
        return realEstate;
      }
    });

    // console.log(estatesFind?.id);

    //realEstate = one-to-many relation to houseDetails

    const houseDataBase = await prisma.houseDetails.create({
      data: {
        uuid: house.uuid,
        address: house.address,
        postcalCode: house.postalCode,
        floorArea: house.floorArea,
        roomCount: house.roomCount,
        availabilityStatus: house.availabilityStatus,
        latitude: house.latitude,
        longitude: house.longitude,
        image: house.image,
        url: house.url,
        realEstateAgentID: estatesFind?.id,
      },
    });

    //salesDatabase = one-to-one relation to houseDetails
    if (house.forSale === true && house.askingPrice !== null) {
      const salesDataBase = await prisma.salesHouse.create({
        data: {
          houseId: house.uuid,
          askingPrice: house.askingPrice,
        },
      });
    }
    //rentalDatabase = one-to-one relation to houseDetails
    if (house.forSale === false) {
      const rentalDataBase = await prisma.rentalHouse.create({
        data: {
          houseId: house.uuid,
          priceMonthly: house.rentalPrice,
        },
      });
    }
  }
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
