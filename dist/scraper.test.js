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
        expect(address).not.toBe("");
    });
    test("should return postal code", () => {
        const postalCode = (0, _1.takePostalCode)(house);
        expect(postalCode).toEqual(expect.any(String));
        expect(postalCode).not.toBe("");
    });
    test("should return price", () => {
        const price = (0, _1.takePrice)(house);
        expect(price).toEqual(expect.any(String));
        expect(price).not.toBe("");
    });
    test("should return details", () => {
        const details = (0, _1.takeDetails)(house);
        expect(details).toEqual(expect.any(String));
        expect(details).not.toBe("");
    });
    test("should return real estate agent", () => {
        const realEstate = (0, _1.takeRealEstate)(house);
        expect(realEstate).toEqual(expect.any(String));
        expect(realEstate).not.toBe("");
    });
    test("house object should contain all properties", () => {
        var _a, _b, _c, _d, _e, _f, _g;
        const houseObject = (0, _1.parseHousing)(house);
        expect(houseObject).not.toBe(undefined);
        expect((_a = houseObject === null || houseObject === void 0 ? void 0 : houseObject.address) === null || _a === void 0 ? void 0 : _a.length).toBeGreaterThan(0);
        expect((_b = houseObject === null || houseObject === void 0 ? void 0 : houseObject.postalCode) === null || _b === void 0 ? void 0 : _b.length).toBeGreaterThan(0);
        expect((_c = houseObject === null || houseObject === void 0 ? void 0 : houseObject.price) === null || _c === void 0 ? void 0 : _c.length).toBeGreaterThan(0);
        expect((_d = houseObject === null || houseObject === void 0 ? void 0 : houseObject.size) === null || _d === void 0 ? void 0 : _d.length).toBeGreaterThan(0);
        expect((_e = houseObject === null || houseObject === void 0 ? void 0 : houseObject.rooms) === null || _e === void 0 ? void 0 : _e.length).toBeGreaterThan(0);
        expect((_f = houseObject === null || houseObject === void 0 ? void 0 : houseObject.availability) === null || _f === void 0 ? void 0 : _f.length).toBeGreaterThan(0);
        expect((_g = houseObject === null || houseObject === void 0 ? void 0 : houseObject.realEstate) === null || _g === void 0 ? void 0 : _g.length).toBeGreaterThan(0);
    });
});
