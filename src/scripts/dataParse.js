/*const axios = require("axios");
const fs = require("fs");

axios.get("https://www.cdek.ru/api-site/website/office/map?websiteId=ru&locale=ru")
    /!*.then(response => {
        let data = []

        response.data.data.data.forEach(item => {
            if (item.type !== "POSTAMAT") {
                console.log(item)
            }
        })

    })*!/.then(response => {
        fs.writeFileSync("../data/data.json", JSON.stringify(response.data.data.data, null, 4))
    })*/



