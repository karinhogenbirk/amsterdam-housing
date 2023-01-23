"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amsterdamRent_1 = __importDefault(require("./testdata/amsterdamRent"));
const utils_1 = require("./utils");
const scraper_1 = require("./scraper");
const _1 = require(".");
describe("Find house listings", () => {
    test("should find all ordered lists", () => {
        const doc = (0, utils_1.htmlToJSDOM)(amsterdamRent_1.default);
        const listings = (0, scraper_1.parseListings)(doc);
        expect(listings.length).toBeGreaterThan(0);
    });
});
describe("Create clean scraping result", () => {
    test("should remove RegEx from string", () => {
        const addressTest = "\n              Hobbemakade 30 A.\n";
        const removedRegEx = (0, _1.removeSpaces)(addressTest);
        expect(removedRegEx).toMatch(new RegExp("Hobbemakade 30 A."));
    });
});
describe("Create object with house details", () => {
    const dom = (0, utils_1.htmlToJSDOM)(amsterdamRent_1.default);
    const listedHouses = (0, scraper_1.parseListings)(dom);
    const house = listedHouses[1].querySelector("li");
    test("should return house address", () => {
        const address = (0, _1.takeAddress)(house);
        expect(address).toEqual(expect.any(String));
    });
    test("should return postal code", () => {
        const postalCode = (0, _1.takePostalCode)(house);
        expect(postalCode).toEqual(expect.any(String));
    });
    test("should return price", () => {
        const price = (0, _1.takePrice)(house);
        expect(price).toEqual(expect.any(String));
    });
    test("should return details", () => {
        const details = (0, _1.takeDetails)(house);
        expect(details).toEqual(expect.any(String));
    });
    test("should return real estate agent", () => {
        const realEstate = (0, _1.takeRealEstate)(house);
        expect(realEstate).toEqual(expect.any(String));
    });
    test("should create object of house details", () => {
        const houseObject = (0, _1.parseHousing)(house);
        console.log(houseObject);
        expect(houseObject).toMatchObject;
    });
});
