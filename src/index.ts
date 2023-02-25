import { parseListings } from "./scraper";
import { htmlToJSDOM } from "./utils";
import axios from "axios";
import fs, { truncate } from "fs";
import dotenv from "dotenv";
dotenv.config();
import { v4 as uuidv4 } from "uuid";
const APIKey: string = process.env.API_KEY;
import { THouseObject, TCoordinates } from "./entities";

function clearHouseDetails() {
  truncate("houseDetails.json", (err) => {
    if (err) throw err;
    console.log("houseDetails.json was truncated");
  });
}

async function getCoordinates(address: string | undefined | null) {
  if (typeof address === "string") {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${APIKey}`
    );
    const data = response.data;
    const geometry = data.results[0].geometry;
    const coordinates = geometry.location;
    const coordinatesObject: TCoordinates = {
      address: address,
      latitude: coordinates.lat,
      longitude: coordinates.lng,
    };
    return coordinatesObject;
  }
}

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

export function takeImage(listedHouse: HTMLElement | null) {
  if (listedHouse !== null) {
    const imageQuery = listedHouse.querySelector("img");
    const image = imageQuery?.getAttribute("src");
    return image;
  } else {
    return null;
  }
}

export function takeUrl(listedHouse: HTMLElement | null) {
  if (listedHouse !== null) {
    const urlQuery = listedHouse.querySelector("a");
    const url = "http://www.funda.nl" + urlQuery?.getAttribute("href");
    return url;
  } else {
    return null;
  }
}

let coordinatesArray: Array<TCoordinates> = [];

export async function parseHousing(listedHouse: HTMLElement | null) {
  try {
    let houseObject: THouseObject = {
      uuid: "",
      address: "",
      postalCode: "",
      rentalPrice: null,
      askingPrice: null,
      floorArea: null,
      roomCount: null,
      availabilityStatus: "",
      realEstate: "",
      latitude: null,
      longitude: null,
      image: "",
      url: "",
      forSale: null,
    };

    houseObject.uuid = uuidv4();
    const addressQuery = takeAddress(listedHouse);
    const address = removeSpaces(addressQuery);

    houseObject.address = address;

    const postalCodeQuery = takePostalCode(listedHouse);
    const postalCode = removeSpaces(postalCodeQuery);
    houseObject.postalCode = postalCode;
    const fullAddress = address + " " + postalCode;
    const coordinates = await getCoordinates(fullAddress);
    coordinatesArray.push(coordinates as TCoordinates);
    houseObject.latitude = coordinates?.latitude as number;
    houseObject.longitude = coordinates?.longitude as number;
    fs.writeFileSync("./coordinates.json", JSON.stringify(coordinatesArray));

    const priceQuery = listedHouse?.querySelectorAll(".search-result-price");
    if (priceQuery !== undefined) {
      for (let index = 0; index < priceQuery.length; index++) {
        const price = priceQuery[index].textContent;
        if (price?.includes("k.k.")) {
          const trimmedPrice = price
            .replace("€", "")
            .replace("k.k.", "")
            .replace(".", "");
          houseObject.askingPrice = Number(trimmedPrice) * 1000;
          houseObject.forSale = true;
        } else if (price?.includes("Van")) {
          const priceArray = price.split(" ");
          const trimmedPrice = priceArray[2];
          houseObject.rentalPrice = Number(trimmedPrice.replace(".", ""));
          houseObject.forSale = false;
        } else {
          const priceWithoutEuro = price
            ?.replace("€", "")
            .replace("/mnd", "")
            .replace(".", "");
          houseObject.rentalPrice = Number(priceWithoutEuro);
          houseObject.forSale = false;
        }
      }
    }

    const detailsQuery = takeDetails(listedHouse);

    const details: string | null | undefined = removeSpaces(detailsQuery);
    console.log(details);
    // const roomCountRegex = /d+(?=s*kamers)/;
    //RegExp("d+(?=s*kamers)", "gi");

    if (typeof details === "string") {
      // console.log(details.match(roomCountRegex));
      const detailsArray: Array<string> = details?.split(" ");
      //SCENARIOS:
      //zonder kamers:
      //1. met streepje: [ '', '83', '-', '130', 'm²', '' ]
      //2. zonder streepje: [ '', '1.000', 'm²', '' ]
      if (detailsArray.includes("kamers") === false) {
        houseObject.roomCount = null;
        if (detailsArray.includes("-")) {
          const availability =
            detailsArray[7] + " " + detailsArray[8] + " " + detailsArray[9];
          if (availability.includes("undefined")) {
            houseObject.availabilityStatus = "Unknown";
          } else {
            houseObject.availabilityStatus = availability;
          }
        } else {
          const availability =
            detailsArray[5] + " " + detailsArray[6] + " " + detailsArray[7];
          if (availability.includes("undefined")) {
            houseObject.availabilityStatus = "Unknown";
          } else {
            houseObject.availabilityStatus = availability;
          }
        }
        //met kamers:
        //1. met streepje: [ '', '70', '-', '222', 'm²', '3', 'kamers', '' ]
        //2. zonder streepje: [ '', '150', 'm²', '4', 'kamers', '' ]
        //3. zonder streepje met /
      } else {
        if (detailsArray.includes("-")) {
          houseObject.roomCount = Number(detailsArray[5]);
          const availability =
            detailsArray[7] + " " + detailsArray[8] + " " + detailsArray[9];
          if (availability.includes("undefined")) {
            houseObject.availabilityStatus = "Unknown";
          } else {
            houseObject.availabilityStatus = availability;
          }
        } else if (detailsArray[3] == "/") {
          let takeRoomCount = detailsArray[6];
          let availability =
            detailsArray[8] + " " + detailsArray[9] + " " + detailsArray[10];
          if (availability.includes("undefined")) {
            houseObject.availabilityStatus = "Unknown";
          } else {
            houseObject.availabilityStatus = availability;
          }
          houseObject.roomCount = Number(takeRoomCount);
        } else {
          const availability =
            detailsArray[5] + " " + detailsArray[6] + " " + detailsArray[7];
          if (availability.includes("undefined")) {
            houseObject.availabilityStatus = "Unknown";
          } else {
            houseObject.availabilityStatus = availability;
          }
          houseObject.roomCount = Number(detailsArray[3]);
        }
      }

      const squareMeter = detailsArray[1];
      houseObject.floorArea = Number(squareMeter);
    }

    const realEstateQuery = takeRealEstate(listedHouse);
    houseObject.realEstate = removeSpaces(realEstateQuery);
    const imageQuery = takeImage(listedHouse);
    houseObject.image = imageQuery;
    const urlQuery = takeUrl(listedHouse);
    houseObject.url = urlQuery;

    return houseObject;
  } catch (error) {
    console.log(error);
  }
}

const houseArray: Array<THouseObject> = [];

async function getFundaPage(pageNumber: number) {
  const response = await axios.get(
    `https://www.funda.nl/huur/amsterdam/p${pageNumber}`
  );
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

      const houseObject = await parseHousing(listedHouse[index]);
      // console.log(houseObject);
      if (houseObject !== undefined) {
        houseArray.push(houseObject);
      }
    }
  }
  fs.writeFileSync("./houseDetails.json", JSON.stringify(houseArray));
  // console.log(houseArray);
}

function sleep() {
  return new Promise(function (resolve) {
    setTimeout(resolve, 5000);
  });
}

async function getPageLimit() {
  clearHouseDetails();
  const response = await axios.get(`https://www.funda.nl/huur/amsterdam/`);
  const html = response.data;
  const doc = htmlToJSDOM(html);
  const pageListings = doc.window.document.querySelector(".pagination-pages");
  const pagination = pageListings?.querySelectorAll("a");
  if (pagination !== undefined) {
    const pageAmount = pagination.length;
    const lastPage = pagination[pageAmount - 1].textContent;
    const lastPageNumber = lastPage?.replace(/[\s]{2,}/, "").split(" ")[1];
    getPages(Number(lastPageNumber));
  }
}

async function getPages(lastPageNumber: number) {
  for (let index = 1; index <= lastPageNumber; index++) {
    const pageNumber = index;
    await sleep();
    getFundaPage(pageNumber);
  }
}

getPageLimit();

// to test:
// getFundaPage(45);
// getCoordinates("Hellingbaan 326 1033 DB Amsterdam");
// clearHouseDetails();
