"use strict";
exports.__esModule = true;
exports.htmlToJSDOM = void 0;
var jsdom_1 = require("jsdom");
function htmlToJSDOM(html) {
    var doc = new jsdom_1.JSDOM(html);
    return doc;
}
exports.htmlToJSDOM = htmlToJSDOM;
