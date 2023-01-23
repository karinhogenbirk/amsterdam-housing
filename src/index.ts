import { parseListings } from "./scraper";
import { htmlToJSDOM } from "./utils";
import axios from "axios";
import fs from "fs";

export function removeSpaces(query: string | undefined | null) {
  if (typeof query === "string") {
    const cleanQuery = query.replace(/\\n]+|[\s]{2,}|[, ]+/g, " ");
    return cleanQuery;
  } else {
    return null;
  }
}

type THouseObject = {
  address: string | null | undefined;
  postalCode: string | null | undefined;
  price: string | null | undefined;
  size: string | null | undefined;
  rooms: string | null | undefined;
  realEstate: string | null | undefined;
};

const houseArray: Array<object> = [];

async function getFundaPage() {
  const response = await axios.get("https://www.funda.nl/huur/amsterdam/");
  const html = response.data;
  const doc = htmlToJSDOM(html);
  const listedHouses = parseListings(doc);

  for (let index = 0; index < listedHouses.length; index++) {
    const listedHouse = listedHouses[index].querySelectorAll("li");

    for (let index = 0; index < listedHouse.length; index++) {
      let houseObject: THouseObject = {
        address: "",
        postalCode: "",
        price: "",
        size: "",
        rooms: "",
        realEstate: "",
      };
      const addressQuery = listedHouse[index].querySelector("h2")?.textContent;

      if (addressQuery === undefined) {
        continue;
      }

      houseObject.address = removeSpaces(addressQuery);

      const postalCodeQuery =
        listedHouse[index].querySelector("h4")?.textContent;

      houseObject.postalCode = removeSpaces(postalCodeQuery);

      const priceQuery = listedHouse[index].querySelector(
        ".search-result-price"
      )?.textContent;

      if (priceQuery !== undefined) {
        const priceWithoutEuro = priceQuery?.replace("€", "");
        const priceOnlyNumber = priceWithoutEuro?.replace("/mnd", "");

        houseObject.price = priceOnlyNumber;
      }

      const detailsQuery = listedHouse[index].querySelector(
        ".search-result-kenmerken"
      )?.textContent;

      const details: string | null | undefined = removeSpaces(detailsQuery);
      if (typeof details === "string") {
        const detailsArray: Array<string> = details?.split(" ");
        const squareMeter = detailsArray[1];
        houseObject.size = squareMeter;
        const roomCount = detailsArray[3];
        if (roomCount == "/") {
          let takeRoomCount = detailsArray[6];
          houseObject.rooms = takeRoomCount;
        } else {
          houseObject.rooms = roomCount;
        }
      }

      const realEstateQuery = listedHouse[index].querySelector(
        ".search-result-makelaar-name"
      )?.textContent;

      houseObject.realEstate = removeSpaces(realEstateQuery);

      houseArray.push(houseObject);
    }
  }
  fs.writeFileSync("./houseDetails.json", JSON.stringify(houseArray));
  console.log(houseArray);
}

getFundaPage();
