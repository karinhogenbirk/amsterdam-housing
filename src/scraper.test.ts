import html from "./testdata/amsterdamRent";
import { htmlToJSDOM } from "./utils";
import { parseListings } from "./scraper";
import { removeSpaces, takeAddress } from ".";

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
  test("should return house address", () => {
    const dom = htmlToJSDOM(html);
    const listedHouses = parseListings(dom);
    const house: HTMLElement | null = listedHouses[1].querySelector("li");
    const address = takeAddress(house);

    expect(address).toEqual(expect.any(String));
  });
});
