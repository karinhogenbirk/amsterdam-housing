import { JSDOM } from "jsdom";

export function parseListings(jsdom: JSDOM) {
  const listedHouses = jsdom.window.document.querySelectorAll("ol");
  return listedHouses;
}
