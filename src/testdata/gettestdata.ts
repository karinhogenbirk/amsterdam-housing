import { getRentAmsterdam } from "../requests";
import fs from "fs";

async function getTestHtml() {
  const html = await getRentAmsterdam();
  fs.writeFileSync(__dirname + "/amsterdamRent.html", html);
}

getTestHtml();
