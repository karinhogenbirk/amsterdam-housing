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

export function takeAddress(listedHouse: HTMLElement | null) {
  if (listedHouse !== null) {
    const addressQuery = listedHouse.querySelector("h2")?.textContent;
    return addressQuery;
  } else {
    return null;
  }
}

export function takePostalCode(listedHouse: HTMLElement | null) {
  if (listedHouse !== null) {
    const postalCodeQuery = listedHouse.querySelector("h4")?.textContent;
    return postalCodeQuery;
  } else {
    return null;
  }
}

export function takePrice(listedHouse: HTMLElement | null) {
  if (listedHouse !== null) {
    const priceQuery = listedHouse.querySelector(
      ".search-result-price"
    )?.textContent;
    return priceQuery;
  } else {
    return null;
  }
}

export function takeDetails(listedHouse: HTMLElement | null) {
  if (listedHouse !== null) {
    const detailsQuery = listedHouse.querySelector(
      ".search-result-kenmerken"
    )?.textContent;
    return detailsQuery;
  } else {
    return null;
  }
}

export function takeRealEstate(listedHouse: HTMLElement | null) {
  if (listedHouse !== null) {
    const realEstateQuery = listedHouse.querySelector(
      ".search-result-makelaar-name"
    )?.textContent;
    return realEstateQuery;
  } else {
    return null;
  }
}

export function parseHousing(listedHouse: HTMLElement | null) {
  let houseObject: THouseObject = {
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
  const priceWithoutEuro = priceQuery?.replace("€", "");
  const priceOnlyNumber = priceWithoutEuro?.replace("/mnd", "");
  houseObject.price = priceOnlyNumber;

  const detailsQuery = takeDetails(listedHouse);

  const details: string | null | undefined = removeSpaces(detailsQuery);
  if (typeof details === "string") {
    const detailsArray: Array<string> = details?.split(" ");
    const squareMeter = detailsArray[1];
    const availability =
      detailsArray[5] + " " + detailsArray[6] + " " + detailsArray[7];
    houseObject.size = squareMeter;
    const roomCount = detailsArray[3];
    if (roomCount == "/") {
      let takeRoomCount = detailsArray[6];
      let takeAvailabily =
        detailsArray[8] + " " + detailsArray[9] + " " + detailsArray[10];
      houseObject.rooms = takeRoomCount;
      houseObject.availability = takeAvailabily;
    } else {
      houseObject.rooms = roomCount;
      houseObject.availability = availability;
    }
  }

  const realEstateQuery = takeRealEstate(listedHouse);
  houseObject.realEstate = removeSpaces(realEstateQuery);

  houseArray.push(houseObject);
}

type THouseObject = {
  address: string | null | undefined;
  postalCode: string | null | undefined;
  price: string | null | undefined;
  size: string | null | undefined;
  rooms: string | null | undefined;
  availability: string | null | undefined;
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
      const addressQuery = takeAddress(listedHouse[index]);
      if (addressQuery === undefined) {
        continue;
      }
      parseHousing(listedHouse[index]);
    }
  }
  // fs.writeFileSync("./houseDetails.json", JSON.stringify(houseArray));
  console.log(houseArray);
}

getFundaPage();
