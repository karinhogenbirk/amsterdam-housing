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
exports.removeSpaces = void 0;
const scraper_1 = require("./scraper");
const utils_1 = require("./utils");
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
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
const houseArray = [];
function getFundaPage() {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get("https://www.funda.nl/huur/amsterdam/");
        const html = response.data;
        const doc = (0, utils_1.htmlToJSDOM)(html);
        const listedHouses = (0, scraper_1.parseListings)(doc);
        for (let index = 0; index < listedHouses.length; index++) {
            const listedHouse = listedHouses[index].querySelectorAll("li");
            for (let index = 0; index < listedHouse.length; index++) {
                let houseObject = {
                    address: "",
                    postalCode: "",
                    price: "",
                    size: "",
                    rooms: "",
                    realEstate: "",
                };
                const addressQuery = (_a = listedHouse[index].querySelector("h2")) === null || _a === void 0 ? void 0 : _a.textContent;
                if (addressQuery === undefined) {
                    continue;
                }
                houseObject.address = removeSpaces(addressQuery);
                const postalCodeQuery = (_b = listedHouse[index].querySelector("h4")) === null || _b === void 0 ? void 0 : _b.textContent;
                houseObject.postalCode = removeSpaces(postalCodeQuery);
                const priceQuery = (_c = listedHouse[index].querySelector(".search-result-price")) === null || _c === void 0 ? void 0 : _c.textContent;
                if (priceQuery !== undefined) {
                    const priceWithoutEuro = priceQuery === null || priceQuery === void 0 ? void 0 : priceQuery.replace("€", "");
                    const priceOnlyNumber = priceWithoutEuro === null || priceWithoutEuro === void 0 ? void 0 : priceWithoutEuro.replace("/mnd", "");
                    houseObject.price = priceOnlyNumber;
                }
                const detailsQuery = (_d = listedHouse[index].querySelector(".search-result-kenmerken")) === null || _d === void 0 ? void 0 : _d.textContent;
                const details = removeSpaces(detailsQuery);
                if (typeof details === "string") {
                    const detailsArray = details === null || details === void 0 ? void 0 : details.split(" ");
                    const squareMeter = detailsArray[1];
                    houseObject.size = squareMeter;
                    const roomCount = detailsArray[3];
                    if (roomCount == "/") {
                        let takeRoomCount = detailsArray[6];
                        houseObject.rooms = takeRoomCount;
                    }
                    else {
                        houseObject.rooms = roomCount;
                    }
                }
                const realEstateQuery = (_e = listedHouse[index].querySelector(".search-result-makelaar-name")) === null || _e === void 0 ? void 0 : _e.textContent;
                houseObject.realEstate = removeSpaces(realEstateQuery);
                houseArray.push(houseObject);
            }
        }
        fs_1.default.writeFileSync("./houseDetails.json", JSON.stringify(houseArray));
        console.log(houseArray);
    });
}
getFundaPage();
