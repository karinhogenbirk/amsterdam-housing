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
        const houseDetails = listedHouse.querySelectorAll("li");
       
        for (let index = 0; index < houseDetails.length; index++) {
            const addressQuery = houseDetails[index].querySelector("h2")?.textContent
            let address = "";
            if(addressQuery !== undefined) {
              address = addressQuery
             }
            // console.log(address)
            const postalCodeQuery = houseDetails[index].querySelector("h4")?.textContent
            let postalCode = "";
            if(postalCodeQuery !== undefined ) {
               postalCode = postalCodeQuery 
            }
            // console.log(postalCode)
            const priceQuery = houseDetails[index].querySelector(".search-result-price")?.textContent
            let price = "";
            if(priceQuery !== undefined) {
                price = priceQuery
            }
            // console.log(price)
            const detailsQuery = houseDetails[index].querySelector("ul")?.textContent
            let details = "";
            if(detailsQuery !== undefined) {
                details = detailsQuery
            }
            // console.log(details)
            const realEstateQuery = houseDetails[index].querySelector(".search-result-makelaar-name")?.textContent
            let realEstate = "";
            if(realEstateQuery !== undefined) {
                realEstate = realEstateQuery
            }
            // console.log(realEstate)

            const houseObject = {
                address: address,
                postalCode: postalCode,
                price: price,
                details: details,
                realEstate:  realEstate
            }

            //BUG: remove spaces + \n from results in object

            console.log(houseObject)
    
        }   
    }
}

getFundaPage()
