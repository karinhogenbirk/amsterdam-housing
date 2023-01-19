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
    return __awaiter(this, void 0, void 0, function* () {
        // let urls = ["https://www.funda.nl/huur/amsterdam/", "https://www.funda.nl/huur/amsterdam/p2/"];
        // const requests = urls.map((url) => axios.get(url));
        // const response = await axios.all(requests)
        const response = yield axios.default.get("https://www.funda.nl/huur/amsterdam/");
        // const response = await axios.all([url1, url2]).then((data: any)=> {
        //     console.log(data)
        // })
        const html = response.data; //get HTML
        const doc = new JSDOM(html); //parses HTML into object
        const listedHouses = doc.window.document.querySelectorAll("ol");
        class HouseObject {
        }
        const housesArray = [{ HouseObject }];
        for (let index = 0; index < listedHouses.length; index++) {
            const listedHouse = listedHouses[index];
            const houseDetails = listedHouse.querySelectorAll(".search-result-content");
            // console.log(houseDetails)
            for (let index = 0; index < houseDetails.length; index++) {
                const element = houseDetails[index].textContent; //house details per house in text
                const stringElement = JSON.stringify(element);
                const trimmedLines = stringElement.replace(/\\n+|[\s]{3,}|[, ]+/g, "~");
                // console.log(trimmedLines)
                const array = trimmedLines.split('~');
                //get the address
                let address = array[11] + " " + array[12] + " " + array[13] +
                    array[24] + " " + array[25];
                if (address.includes("Amsterdam") === false) {
                    address += " Amsterdam";
                }
                console.log(address);
                //get the price
                let rentalPrice = array[56] + array[57] + array[58] + array[59] + array[60];
                console.log(rentalPrice);
                //get the size
                let size = array[68] + " " + array[69] + " " + array[70] + " " + array[71] + " " + array[72];
                if (size.includes("m") === false) {
                    size += array[77] + array[78] + array[79] + array[80];
                }
                console.log(size);
                //get roomcount
                let roomCount = array[76] + " " + array[77] + " " + array[78] + " " + array[79];
                console.log(roomCount);
                //creat object
                // const houseObject = {
                // address: address
                // }
            }
        }
    });
}
getFundaPage();
