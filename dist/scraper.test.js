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
    test("should return house address", () => {
        const dom = (0, utils_1.htmlToJSDOM)(amsterdamRent_1.default);
        const listedHouses = (0, scraper_1.parseListings)(dom);
        const house = listedHouses[1].querySelector("li");
        const address = (0, _1.takeAddress)(house);
        expect(address).toEqual(expect.any(String));
    });
});
