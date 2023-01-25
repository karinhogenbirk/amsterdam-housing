import html from "./testdata/amsterdamRent";
import { htmlToJSDOM } from "./utils";
import { parseListings } from "./scraper";
import {
  parseHousing,
  removeSpaces,
  takeAddress,
  takeDetails,
  takePostalCode,
  takePrice,
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

  test("should return price", () => {
    const price = takePrice(house);
    expect(price).toEqual(expect.any(String));
    expect(price).not.toBe("");
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

  test("house object should contain all properties", () => {
    const houseObject = parseHousing(house);

    expect(houseObject).not.toBe(undefined);
    expect(houseObject?.address?.length).toBeGreaterThan(0);
    expect(houseObject?.postalCode?.length).toBeGreaterThan(0);
    expect(houseObject?.price?.length).toBeGreaterThan(0);
    expect(houseObject?.size?.length).toBeGreaterThan(0);
    expect(houseObject?.rooms?.length).toBeGreaterThan(0);
    expect(houseObject?.availability?.length).toBeGreaterThan(0);
    expect(houseObject?.realEstate?.length).toBeGreaterThan(0);
  });
});
