"use strict";
exports.__esModule = true;
exports.parseListings = void 0;
function parseListings(jsdom) {
    var listedHouses = jsdom.window.document.querySelectorAll("ol");
    return listedHouses;
}
exports.parseListings = parseListings;
