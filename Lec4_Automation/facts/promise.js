// Promise => 
let fs = require("fs");
console.log("Before");
// pending promise
let content = fs.promises.readFile("./f1.txt");
console.log(content);

content.then(function(data){
    console.log("Content " + data);
})
content.catch(function(err){
    console.log(err);
})



console.log("After");