import html from "./testdata/amsterdamRent";
import { htmlToJSDOM } from "./utils";
import { parseListings } from "./scraper";
import { removeSpaces } from ".";

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
