const request = require("request");
const fs = require("fs");
const cheerio = require("cheerio");
const getMatchDetails = require("./match");


function getAllMatches(link){   
    request(link , cb);
}

function cb(error , response , html){
    if(error == null && response.statusCode == 200){
        parseData(html);
    }
    else if(response.statusCode == 404){
        console.log("Page not found");
    }
    else{
        console.log(error);
    }
}

function parseData(html){
    // console.log(html);
    let ch = cheerio.load(html);
    let links = ch('a[data-hover="Scorecard"]');
    for(let i=0 ; i<links.length ; i++){
        let link = cheerio(links[i]).attr("href");
        let completeLink = "https://www.espncricinfo.com"+link;
        getMatchDetails(completeLink);
    }
}


module.exports = getAllMatches;