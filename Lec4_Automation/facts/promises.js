let fs = require("fs");

// chaining concept
console.log("Before");

// Syntax sugar => behind the scene Callbacks
// async task
let pendingPromise = fs.promises.readFile("./f1.txt");
// when promise is resolved();
pendingPromise
  .then(function (data) {
    console.log("Content " + data);
  })
  .then(function () {
    let secondFilePromise = fs.promises.readFile("./f2.txt");
    return secondFilePromise;
  })
  .then(function (data) {
    console.log("Content " + data);
  })
  .then(function () {
    let thirdFilePromise = fs.promises.readFile("./f3.txt");
    return thirdFilePromise;
  })
  .then(function (data) {
    console.log("Content " + data);
  })
  .catch(function (error) {
    console.log(error);
  });
  
console.log("After");
