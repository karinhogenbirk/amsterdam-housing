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
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const axios = require("axios");
function getFundaPage() {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios.default.get("https://www.funda.nl/huur/amsterdam/");
        const html = response.data; //get HTML
        const doc = new JSDOM(html); //parses HTML into object
        const listedHouses = doc.window.document.querySelectorAll("ol");
        class HouseObject {
        }
        const housesArray = [{ HouseObject }];
        for (let index = 0; index < listedHouses.length; index++) {
            const listedHouse = listedHouses[index];
            const houseDetails = listedHouse.querySelectorAll("li");
            for (let index = 0; index < houseDetails.length; index++) {
                const addressQuery = (_a = houseDetails[index].querySelector("h2")) === null || _a === void 0 ? void 0 : _a.textContent;
                let address = "";
                if (addressQuery !== undefined) {
                    address = addressQuery;
                }
                // console.log(address)
                const postalCodeQuery = (_b = houseDetails[index].querySelector("h4")) === null || _b === void 0 ? void 0 : _b.textContent;
                let postalCode = "";
                if (postalCodeQuery !== undefined) {
                    postalCode = postalCodeQuery;
                }
                // console.log(postalCode)
                const priceQuery = (_c = houseDetails[index].querySelector(".search-result-price")) === null || _c === void 0 ? void 0 : _c.textContent;
                let price = "";
                if (priceQuery !== undefined) {
                    price = priceQuery;
                }
                // console.log(price)
                const detailsQuery = (_d = houseDetails[index].querySelector("ul")) === null || _d === void 0 ? void 0 : _d.textContent;
                let details = "";
                if (detailsQuery !== undefined) {
                    details = detailsQuery;
                }
                // console.log(details)
                const realEstateQuery = (_e = houseDetails[index].querySelector(".search-result-makelaar-name")) === null || _e === void 0 ? void 0 : _e.textContent;
                let realEstate = "";
                if (realEstateQuery !== undefined) {
                    realEstate = realEstateQuery;
                }
                // console.log(realEstate)
                const houseObject = {
                    address: address,
                    postalCode: postalCode,
                    price: price,
                    details: details,
                    realEstate: realEstate
                };
                //BUG: remove spaces + \n from results in object
                console.log(houseObject);
            }
        }
    });
}
getFundaPage();
