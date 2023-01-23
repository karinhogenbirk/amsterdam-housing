"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseHousing = exports.takeRealEstate = exports.takeDetails = exports.takePrice = exports.takePostalCode = exports.takeAddress = exports.removeSpaces = void 0;
const scraper_1 = require("./scraper");
const utils_1 = require("./utils");
const axios_1 = __importDefault(require("axios"));
function removeSpaces(query) {
    if (typeof query === "string") {
        const cleanQuery = query.replace(/\\n]+|[\s]{2,}|[, ]+/g, " ");
        return cleanQuery;
    }
    else {
        return null;
    }
}
exports.removeSpaces = removeSpaces;
function takeAddress(listedHouse) {
    var _a;
    if (listedHouse !== null) {
        const addressQuery = (_a = listedHouse.querySelector("h2")) === null || _a === void 0 ? void 0 : _a.textContent;
        return addressQuery;
    }
    else {
        return null;
    }
}
exports.takeAddress = takeAddress;
function takePostalCode(listedHouse) {
    var _a;
    if (listedHouse !== null) {
        const postalCodeQuery = (_a = listedHouse.querySelector("h4")) === null || _a === void 0 ? void 0 : _a.textContent;
        return postalCodeQuery;
    }
    else {
        return null;
    }
}
exports.takePostalCode = takePostalCode;
function takePrice(listedHouse) {
    var _a;
    if (listedHouse !== null) {
        const priceQuery = (_a = listedHouse.querySelector(".search-result-price")) === null || _a === void 0 ? void 0 : _a.textContent;
        return priceQuery;
    }
    else {
        return null;
    }
}
exports.takePrice = takePrice;
function takeDetails(listedHouse) {
    var _a;
    if (listedHouse !== null) {
        const detailsQuery = (_a = listedHouse.querySelector(".search-result-kenmerken")) === null || _a === void 0 ? void 0 : _a.textContent;
        return detailsQuery;
    }
    else {
        return null;
    }
}
exports.takeDetails = takeDetails;
function takeRealEstate(listedHouse) {
    var _a;
    if (listedHouse !== null) {
        const realEstateQuery = (_a = listedHouse.querySelector(".search-result-makelaar-name")) === null || _a === void 0 ? void 0 : _a.textContent;
        return realEstateQuery;
    }
    else {
        return null;
    }
}
exports.takeRealEstate = takeRealEstate;
function parseHousing(listedHouse) {
    let houseObject = {
        address: "",
        postalCode: "",
        price: "",
        size: "",
        rooms: "",
        availability: "",
        realEstate: "",
    };
    const addressQuery = takeAddress(listedHouse);
    houseObject.address = removeSpaces(addressQuery);
    const postalCodeQuery = takePostalCode(listedHouse);
    houseObject.postalCode = removeSpaces(postalCodeQuery);
    const priceQuery = takePrice(listedHouse);
    const priceWithoutEuro = priceQuery === null || priceQuery === void 0 ? void 0 : priceQuery.replace("€", "");
    const priceOnlyNumber = priceWithoutEuro === null || priceWithoutEuro === void 0 ? void 0 : priceWithoutEuro.replace("/mnd", "");
    houseObject.price = priceOnlyNumber;
    const detailsQuery = takeDetails(listedHouse);
    const details = removeSpaces(detailsQuery);
    if (typeof details === "string") {
        const detailsArray = details === null || details === void 0 ? void 0 : details.split(" ");
        const squareMeter = detailsArray[1];
        const availability = detailsArray[5] + " " + detailsArray[6] + " " + detailsArray[7];
        houseObject.size = squareMeter;
        const roomCount = detailsArray[3];
        if (roomCount == "/") {
            let takeRoomCount = detailsArray[6];
            let takeAvailabily = detailsArray[8] + " " + detailsArray[9] + " " + detailsArray[10];
            houseObject.rooms = takeRoomCount;
            houseObject.availability = takeAvailabily;
        }
        else {
            houseObject.rooms = roomCount;
            houseObject.availability = availability;
        }
    }
    const realEstateQuery = takeRealEstate(listedHouse);
    houseObject.realEstate = removeSpaces(realEstateQuery);
    houseArray.push(houseObject);
}
exports.parseHousing = parseHousing;
const houseArray = [];
function getFundaPage() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get("https://www.funda.nl/huur/amsterdam/");
        const html = response.data;
        const doc = (0, utils_1.htmlToJSDOM)(html);
        const listedHouses = (0, scraper_1.parseListings)(doc);
        for (let index = 0; index < listedHouses.length; index++) {
            const listedHouse = listedHouses[index].querySelectorAll("li");
            for (let index = 0; index < listedHouse.length; index++) {
                const addressQuery = takeAddress(listedHouse[index]);
                if (addressQuery === undefined) {
                    continue;
                }
                parseHousing(listedHouse[index]);
            }
        }
        // fs.writeFileSync("./houseDetails.json", JSON.stringify(houseArray));
        console.log(houseArray);
    });
}
getFundaPage();
