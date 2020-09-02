// High Order Functions
// Functions which take functions as an argument


function getFirstName(fullName){
    //"Steve Rogers"
    let name = fullName.split(" ")[0];
    //name = ["Steve" , "Rogers"]
    return name;
}

function getLastName(fullName){
    let name = fullName.split(" ")[1];
    return name;
}
// CallBack Function => cb
// callback function is a function which is passed as an argument to a function
function greeter(fullName , cb){
    let name = cb(fullName);
    console.log(name);
}

greeter("Steve Rogers" , getFirstName );
greeter("Tony Stark" , getLastName);


