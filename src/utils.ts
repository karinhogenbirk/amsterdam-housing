import { JSDOM } from "jsdom";

export function htmlToJSDOM(html: string) {
  const doc = new JSDOM(html);
  return doc;
}
