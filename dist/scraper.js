"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseListings = void 0;
function parseListings(jsdom) {
    const listedHouses = jsdom.window.document.querySelectorAll("ol");
    return listedHouses;
}
exports.parseListings = parseListings;
