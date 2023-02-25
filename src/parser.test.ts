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
