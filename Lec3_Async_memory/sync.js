// Synchronous code
// Multithreading ? => parallel tasks

let fs = require("fs");


console.log("Before");;

let content = fs.readFileSync("./f1.txt" , "utf-8");  //=? 10gb
console.log(content);

console.log("After");