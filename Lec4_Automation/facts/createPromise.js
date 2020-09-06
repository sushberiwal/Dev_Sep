let fs = require("fs");

function promisify(path){
    // this function will return a pending promise
    let pendingPromise =  new Promise(function(resolve , reject){
        fs.readFile(path , function(err,data){
            if(err){
                reject(err);
            }
            else{
                resolve(data);
            }
        })
    });
    return pendingPromise;
}


console.log("Before");

// promisify wil give me a pending promise
let content = promisify("./f1.txt");

content.then(function(data){
    console.log("Content " + data);
})
content.catch(function(err){
    console.log(err);
})

console.log("After");