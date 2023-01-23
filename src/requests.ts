import axios from "axios";

export async function getRentAmsterdam() {
  const response = await axios.get("https://www.funda.nl/huur/amsterdam/");
  const html = response.data;
  return html;
}
