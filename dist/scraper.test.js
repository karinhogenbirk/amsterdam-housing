"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amsterdamRent_1 = __importDefault(require("./testdata/amsterdamRent"));
const utils_1 = require("./utils");
const scraper_1 = require("./scraper");
describe("Find house listings", () => {
    test("should find all ordered lists", () => {
        //arrange
        const doc = (0, utils_1.htmlToJSDOM)(amsterdamRent_1.default);
        const listings = (0, scraper_1.parseListings)(doc);
        //assert
        expect(listings.length).toBeGreaterThan(0);
    });
});
