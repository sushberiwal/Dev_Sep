// we have to install request module
// npm install request
// language => callbacks , promises , async await , callback hell , try catch , promises chaining
const request = require("request");
const fs = require("fs");
const cheerio = require("cheerio");
const getAllMatches = require("./allMatches");

let link = "https://www.espncricinfo.com/series/_/id/8039/season/2019/icc-cricket-world-cup";
request( link , cb );

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
    let ch = cheerio.load(html);
    let link = ch(".widget-items.cta-link a").attr("href");
    // console.log(link);
    let completeLink = "https://www.espncricinfo.com"+link;
    getAllMatches(completeLink);
}