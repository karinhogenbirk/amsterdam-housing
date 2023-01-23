import html from "./testdata/amsterdamRent";
import { htmlToJSDOM } from "./utils";
import { parseListings } from "./scraper";

describe("Find house listings", () => {
  test("should find all ordered lists", () => {
    //arrange
    const doc = htmlToJSDOM(html);
    const listings = parseListings(doc);
    //assert
    expect(listings.length).toBeGreaterThan(0);
  });
});
