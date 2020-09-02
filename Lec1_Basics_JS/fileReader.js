// fs module => NodeJS 
// application => fileReader.js => import fs module using require("fs");

const fs = require("fs");

// npm init -y
// npm install cheerio
// for mac -> sudo npm install cheerio
const cheerio = require("cheerio");

// let content = fs.readFileSync("./f1.txt" , "utf-8");

// console.log(content);


let content = fs.readFileSync("./index.html" , "utf-8");


let ch = cheerio.load(content);

let h1Tag = ch("h1").text();
console.log(h1Tag);