const request = require("request");
const fs = require("fs");
const cheerio = require("cheerio");

function getMatchDetails(link) {
  request(link, cb);
}

function cb(error, response, html) {
  if (error == null && response.statusCode == 200) {
    parseData(html);
  } else if (response.statusCode == 404) {
    console.log("Page not found");
  } else {
    console.log(error);
  }
}

function parseData(html) {
  let ch = cheerio.load(html);
  let bothInnings = ch(
    ".card.content-block.match-scorecard-table .Collapsible"
  );
  // => array of bothInnings [  <first Inning>  ,    ]
  for (let i = 0; i < bothInnings.length; i++) {
    let teamName = cheerio(bothInnings[i]).find(".header-title.label").text();
    teamName = teamName.split("Innings")[0].trim();
    console.log(teamName);
    // we will get all tr tag in a inning
    if(!teamName.includes("Team")){
        let allRows = cheerio(bothInnings[i]).find(".table.batsman tbody tr");
        for (let j = 0; j < allRows.length - 1; j++) {
          let allCols = cheerio(allRows[j]).find("td");
          if (allCols.length > 1) {
            // 0 , 2 , 3 , 5 , 6 , 7
            let batsmanName = cheerio(allCols[0]).find("a").text().trim();
            let runs = cheerio(allCols[2]).text().trim();
            let balls = cheerio(allCols[3]).text().trim();
            let fours = cheerio(allCols[5]).text().trim();
            let sixes = cheerio(allCols[6]).text().trim();
            let sr = cheerio(allCols[7]).text().trim();
            // String interpolation
            //  console.log(`${batsmanName} Runs- ${runs} Balls- ${balls} Fours- ${fours} Sixes- ${sixes} SR- ${sr}`);
            processDetails(teamName, batsmanName, runs, balls, fours, sixes, sr);
          }
        }
    }
  }
}

// create json files ?
function teamFolderExists(teamName){
    return fs.existsSync(teamName);
}

function batsmanFileExists(teamName , batsmanName){
    //path => India/MSDhoni.json
    let batsmanPath = `${teamName}/${batsmanName}.json`;
    return fs.existsSync(batsmanPath);
}

function updateBatsmanFile(teamName, batsmanName, runs, balls, fours, sixes, sr){
    //path => India/MSDhoni.json
    let batsmanPath = `${teamName}/${batsmanName}.json`;
    let data = fs.readFileSync(batsmanPath);
    data = JSON.parse(data);
    // [ {} , {} ,{}  ];
    let entry = {
        Runs : runs,
        Balls : balls,
        Fours : fours ,
        Sixes : sixes ,
        StrikeRate : sr 
    };
    data.push(entry);
    data = JSON.stringify(data);
    fs.writeFileSync(batsmanPath , data);
}

function createBatsmanFile(teamName, batsmanName, runs, balls, fours, sixes, sr){
    //path => India/MSDhoni.json
    let batsmanPath = `${teamName}/${batsmanName}.json`;
    let data=[];
    let entry = {
        Runs : runs,
        Balls : balls,
        Fours : fours ,
        Sixes : sixes ,
        StrikeRate : sr 
    };
    data.push(entry);
    data = JSON.stringify(data); // It converts the JSON object in string
    fs.writeFileSync(batsmanPath , data);
}
function createTeamFolder(teamName){
   //teamName => India
    fs.mkdirSync(teamName);
}




function processDetails(teamName, batsmanName, runs, balls, fours, sixes, sr) {
    // check if team folder exists ?
    let isTeamFolder = teamFolderExists(teamName);
    if(isTeamFolder){
        // check if batsman file exists ?
        let isBatsman = batsmanFileExists(teamName , batsmanName);
        if(isBatsman){
            updateBatsmanFile(teamName, batsmanName, runs, balls, fours, sixes, sr);
        }
        else{
            createBatsmanFile(teamName, batsmanName, runs, balls, fours, sixes, sr);
        }
    }
    else{
        createTeamFolder(teamName);
        createBatsmanFile(teamName, batsmanName, runs, balls, fours, sixes, sr);
    }
}

module.exports = getMatchDetails;
