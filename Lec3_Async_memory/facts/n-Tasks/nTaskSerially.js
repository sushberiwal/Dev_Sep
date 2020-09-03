let fs = require("fs");
let files = ["./f1.txt" , "./f2.txt" , "./f3.txt"];
//Recursive
function fileReader(idx){
    if(idx == files.length){
        return;
    }
    fs.readFile(files[idx] , function(err,data){
        console.log("Content " + data);
        fileReader(idx+1);
    })
}
fileReader(0);
// nTask Serially => while loop / for loop cant be done
// for(let i=0 ; i<files.length ; i++){
//     //async
//     fs.readFile(files[i] , function(err,data){
//         console.log("Content " + data);
//     })
// }

// let idx=0;
// while(idx < files.length){
//     fs.readFile(files[idx] , function(err,data){
//         console.log("Content " + data);
//         idx++;
//     })
// }