import html from "./testdata/amsterdamRent";
import { htmlToJSDOM } from "./utils";
import { parseListings } from "./scraper";
import {
  parseHousing,
  removeSpaces,
  takeAddress,
  takeDetails,
  takePostalCode,
  takeRealEstate,
} from ".";
import {
  createHouseArray,
  createRealEstateArray,
  removeDuplicates,
} from "../prisma/seeders/seeder";

describe("Find house listings", () => {
  test("should find all ordered lists", () => {
    const doc = htmlToJSDOM(html);
    const listings = parseListings(doc);
    expect(listings.length).toBeGreaterThan(0);
  });
});

describe("Create clean scraping result", () => {
  test("should remove RegEx from string", () => {
    const addressTest = "\n              Hobbemakade 30 A.\n";
    const removedRegEx = removeSpaces(addressTest);
    expect(removedRegEx).toMatch(new RegExp("Hobbemakade 30 A."));
  });
});

describe("Create object with house details", () => {
  const dom = htmlToJSDOM(html);
  const listedHouses = parseListings(dom);
  const house: HTMLElement | null = listedHouses[1].querySelector("li");
  test("should return house address", () => {
    const address = takeAddress(house);

    expect(address).toEqual(expect.any(String));
    expect(address).not.toBe("");
  });

  test("should return postal code", () => {
    const postalCode = takePostalCode(house);
    expect(postalCode).toEqual(expect.any(String));
    expect(postalCode).not.toBe("");
  });

  test("should return details", () => {
    const details = takeDetails(house);
    expect(details).toEqual(expect.any(String));
    expect(details).not.toBe("");
  });

  test("should return real estate agent", () => {
    const realEstate = takeRealEstate(house);
    expect(realEstate).toEqual(expect.any(String));
    expect(realEstate).not.toBe("");
  });

  test("house object should contain all properties", async () => {
    const houseObject = await parseHousing(house);

    expect(houseObject).not.toBe(undefined);
    expect(houseObject?.address?.length).toBeGreaterThan(0);
    expect(houseObject?.postalCode?.length).toBeGreaterThan(0);
    expect(houseObject?.rentalPrice).toBeGreaterThan(0);
    expect(houseObject?.floorArea).toBeGreaterThan(0);
    expect(houseObject?.roomCount).toBeGreaterThan(0);
    expect(houseObject?.availabilityStatus?.length).toBeGreaterThan(0);
    expect(houseObject?.realEstate?.length).toBeGreaterThan(0);
    expect(houseObject?.latitude).toBeGreaterThan(0);
    expect(houseObject?.longitude).toBeGreaterThan(0);
    expect(houseObject?.url?.length).toBeGreaterThan(0);
    expect(houseObject?.image?.length).toBeGreaterThan(0);
  });
});

describe.only("Test seeding file", () => {
  const houses = [
    {
      uuid: "cc1ef256-58d7-41e7-b3f1-6b58d9c174ca",
      address: " Vossiusstraat 53 D ",
      postalCode: " 1071 AK Amsterdam ",
      rentalPrice: 2800,
      askingPrice: null,
      floorArea: 84,
      roomCount: 2,
      availabilityStatus: "Beschikbaar per 1-3-2023",
      realEstate: "Heeren Makelaars",
      latitude: 52.35985609999999,
      longitude: 4.876808599999999,
      image: "https://cloud.funda.nl/valentina_media/169/343/794_720x480.jpg",
      url: "http://www.funda.nl/huur/amsterdam/appartement-42072270-vossiusstraat-53-d/",
      forSale: false,
    },
    {
      uuid: "cc816bc6-40bf-4932-b3fa-d74d75db9a56",
      address: " Ruysdaelkade 81 HS ",
      postalCode: " 1072 AL Amsterdam ",
      rentalPrice: 3000,
      askingPrice: 950000000,
      floorArea: 114,
      roomCount: 4,
      availabilityStatus: "In overleg ",
      realEstate: "Heeren Makelaars",
      latitude: 52.3560832,
      longitude: 4.8870935,
      image: "https://cloud.funda.nl/valentina_media/170/506/553_720x480.jpg",
      url: "http://www.funda.nl/huur/amsterdam/appartement-42001491-ruysdaelkade-81-hs/",
      forSale: true,
    },
    {
      uuid: "a9e4bd86-1f93-42d8-b40d-b1ed88a3e966",
      address: " Prinsengracht 516 ",
      postalCode: " 1017 KJ Amsterdam ",
      rentalPrice: 12000,
      askingPrice: null,
      floorArea: 569,
      roomCount: 8,
      availabilityStatus: "Per direct beschikbaar",
      realEstate: "Ter Haar Makelaars B.V.",
      latitude: 52.3634447,
      longitude: 4.8860008,
      image: "https://cloud.funda.nl/valentina_media/168/600/419_720x480.jpg",
      url: "http://www.funda.nl/huur/amsterdam/huis-42053705-prinsengracht-516/",
      forSale: false,
    },
  ];
  test("Should return array of real estate agents without duplicates", () => {
    const realEstateArray = createRealEstateArray(houses);
    console.log(realEstateArray);
    expect(realEstateArray.length).toBe(2);
  });

  test("should return array of housedetails", () => {
    const getRealEstates = [
      { name: "Ter Haar Makelaars B.V.", id: 256534 },
      { name: "Heeren Makelaars", id: 352432 },
    ];
    const testHouseArray = createHouseArray(houses, getRealEstates);
    console.log(testHouseArray);
    expect(testHouseArray.length).toBe(3);
    expect(testHouseArray[0].realEstateAgentID).toBe(352432);
  });
});
