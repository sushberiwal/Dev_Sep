let fs = require("fs");
let files = ["./f1.txt" , "./f2.txt" , "./f3.txt"];


console.log("Before");

//iterative 
for(let i=0 ; i<files.length ; i++){
    
    //async
    fs.readFile(files[i] , function(err,data){
        console.log("Content " + data);
    })

}


//recursive
function fileReader(idx){
    if(idx == files.length){
        return;
    }
    fs.readFile(files[idx] , function(err,data){
        console.log("Content " + data);
    })
    fileReader(idx+1);
}
fileReader(0);



console.log("After");