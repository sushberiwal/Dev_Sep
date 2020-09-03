const request = require("request");
const cheerio = require("cheerio");

let lb=[];
let count=0;

function getMatchDetails(link) {
  count++;
  console.log(count + " Sending Request");
  request(link, cb);
}

function cb(error, response, html) {
  if (error == null && response.statusCode == 200) {
    count--;
    console.log(count + " Received Data");
    parseData(html);
    if(count == 0){
      console.table(lb);
    }
  } else if (response.statusCode == 404) {
    console.log("Page not found");
  } else {
    console.log(error);
  }
}

function parseData(html) {
  let ch = cheerio.load(html);
  let bothInnings = ch(".card.content-block.match-scorecard-table .Collapsible");
  let winningTeam = ch(".summary span").text().split("won")[0].trim();
  // console.log("Winning Team => " + winningTeam);
  // => array of bothInnings [  <first Inning>  ,    ]
  for (let i = 0; i < bothInnings.length; i++) {
    let teamName = cheerio(bothInnings[i]).find(".header-title.label").text();
    teamName = teamName.split("Innings")[0].trim();
    // console.log(teamName);
    if(winningTeam == teamName){
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
              createLeaderBoard(teamName, batsmanName, runs, balls, fours, sixes);
            }
          }
      }
    }
  }
}

// create json files ?
function createLeaderBoard(teamName, batsmanName, runs, balls, fours, sixes){
  runs = Number(runs);
  balls = Number(balls);
  fours = Number(fours);
  sixes = Number(sixes);

  // check if batsman entry is already present in leadearboard
  for(let i=0 ; i<lb.length ; i++){
    if(lb[i].Team == teamName && lb[i].Batsman == batsmanName ){
      lb[i].Runs += runs;
      lb[i].Balls += balls;
      lb[i].Fours += fours;
      lb[i].Sixes += sixes;
      return;
    }
  }

  let entry = {
    Team : teamName,
    Batsman : batsmanName ,
    Runs : runs,
    Balls : balls,
    Fours : fours,
    Sixes : sixes
  }
  lb.push(entry);
}

module.exports = getMatchDetails;
