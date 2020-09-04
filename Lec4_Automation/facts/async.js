// callbacks

let fs = require("fs");


console.log("Before");

//Node API => Async tasks
fs.readFile("./f1.txt" , function(err,data){
    console.log("Content "+data);
    fs.readFile("./f2.txt" , function(err,data){
        console.log("Content"+data);
        fs.readFile("./f3.txt",function(err,data){
            console.log("Content"+data);
        })
    })
})


console.log("After");

