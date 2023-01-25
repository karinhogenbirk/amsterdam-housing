"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlToJSDOM = void 0;
const jsdom_1 = require("jsdom");
function htmlToJSDOM(html) {
    const doc = new jsdom_1.JSDOM(html);
    return doc;
}
exports.htmlToJSDOM = htmlToJSDOM;
