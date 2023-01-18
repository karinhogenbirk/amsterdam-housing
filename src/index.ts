const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const axios = require("axios")

async function getFundaPage() {
    const response = await axios.default.get("https://www.funda.nl/huur/amsterdam/");
    const html = response.data //get HTML
    const doc = new JSDOM(html); //parses HTML into object
    const listedHouses = doc.window.document.querySelectorAll("ol"); 

   class HouseObject { 
    address!: string;
    price!: string;
    size!: string;
    rooms!: string;
    availability!: string;
    realEstate!: string;
   }

   const housesArray = [ {HouseObject} ]

    for (let index = 0; index < listedHouses.length; index++) {
        const listedHouse = listedHouses[index];
        const houseDetails = listedHouse.querySelectorAll(".search-result-content");
        // console.log(houseDetails)
        for (let index = 0; index < houseDetails.length; index++) {
            const element = houseDetails[index].textContent; //house details per house in text
            const stringElement = JSON.stringify(element)
            const trimmedLines = stringElement.replace(/\\n+|[\s]{3,}|[, ]+/g, "~")
            // console.log(trimmedLines)
            const array = trimmedLines.split('~');

            //get the address
            let address = array[11] +" "+ array[12] + " " + array[13] + 
            array[24] +" "+ array[25]
            if(address.includes("Amsterdam")=== false) {
                address += " Amsterdam"
            }
            console.log(address)

            //get the price
            let rentalPrice = array[56] + " " + array[57] + " " + array[58] + array[59] + array[60]
            console.log(rentalPrice)
            
            // const houseObject = {
                    // address: address
            // }

            
        }   
    }
}

getFundaPage()

