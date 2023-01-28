import { parseListings } from "./scraper";
import { htmlToJSDOM } from "./utils";
import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
const app: Application = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port: number = 3000;
dotenv.config();
const APIKey: string = process.env.API_KEY;

app.get("/", (_req, res: Response) => {
  res.send(`Server is running on port: ${port}`);
});

async function getCoordinates(address: string | undefined | null) {
  if (typeof address === "string") {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${APIKey}`
    );
    const data = response.data;
    if (data.status === "ZERO_RESULTS") {
      return "no coordinates available";
    } else {
      const geometry = data.results[0].geometry;
      const coordinates = geometry.location;
      return coordinates;
    }
  } else {
    return null;
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

let count = 0;
let maxTries = 3;

export async function parseHousing(listedHouse: HTMLElement | null) {
  count++;
  while (true) {
    try {
      let houseObject: THouseObject = {
        uuid: "",
        address: "",
        postalCode: "",
        rental_price: null,
        floor_area: null,
        room_count: null,
        availability_status: "",
        realEstate: "",
        latitude: null,
        longitude: null,
        image: "",
        url: "",
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
      const latitude = coordinates.lat;
      const longitude = coordinates.lng;
      houseObject.latitude = latitude;
      houseObject.longitude = longitude;

      const priceQuery = takePrice(listedHouse);
      const priceWithoutEuro = priceQuery?.replace("€", "");
      const priceOnlyNumber = priceWithoutEuro?.replace("/mnd", "");
      houseObject.rental_price = Number(priceOnlyNumber) * 1000;

      const detailsQuery = takeDetails(listedHouse);

      const details: string | null | undefined = removeSpaces(detailsQuery);
      if (typeof details === "string") {
        const detailsArray: Array<string> = details?.split(" ");
        const squareMeter = detailsArray[1];
        const availability =
          detailsArray[5] + " " + detailsArray[6] + " " + detailsArray[7];
        houseObject.floor_area = Number(squareMeter);
        const roomCount = detailsArray[3];
        if (roomCount == "/") {
          let takeRoomCount = detailsArray[6];
          let takeAvailabily =
            detailsArray[8] + " " + detailsArray[9] + " " + detailsArray[10];
          houseObject.room_count = Number(takeRoomCount);
          houseObject.availability_status = takeAvailabily;
        } else {
          houseObject.room_count = Number(roomCount);
          houseObject.availability_status = availability;
        }
      }

      const realEstateQuery = takeRealEstate(listedHouse);
      houseObject.realEstate = removeSpaces(realEstateQuery);
      const imageQuery = takeImage(listedHouse);
      houseObject.image = imageQuery;
      const urlQuery = takeUrl(listedHouse);
      houseObject.url = urlQuery;

      return houseObject;
    } catch (error) {
      if (count === maxTries) {
        throw error;
      } else {
        console.log(error, "scraping will be executed again");
        getPageLimit();
      }
    }
  }
}

type THouseObject = {
  uuid: string | null | undefined;
  address: string | null | undefined;
  postalCode: string | null | undefined;
  rental_price: number | null;
  floor_area: number | null;
  room_count: number | null;
  availability_status: string | null | undefined;
  realEstate: string | null | undefined;
  latitude: number | null;
  longitude: number | null;
  image: string | null | undefined;
  url: string | null | undefined;
};

const houseArray: Array<object> = [];

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
      console.log(houseObject);
      if (houseObject !== undefined) {
        houseArray.push(houseObject);
      }
    }
  }
  // fs.writeFileSync("./houseDetails.json", JSON.stringify(houseArray));
  // console.log(houseArray);
}

function sleep() {
  return new Promise(function (resolve) {
    setTimeout(resolve, 10000);
  });
}

async function getPageLimit() {
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

// getPageLimit();

//to test:
getFundaPage(1);
// getCoordinates("Hellingbaan 326 1033 DB Amsterdam");
