const fs = require("fs");


// Heritage High School boundary box
const minLat = 33.175;
const maxLat = 33.207;

const minLng = -96.790;
const maxLng = -96.728;



function pointInside(lat,lng){


return (

lat >= minLat &&
lat <= maxLat &&
lng >= minLng &&
lng <= maxLng

);


}



const students=[];


let attempts=0;



while(
students.length < 200 &&
attempts < 50000
){


attempts++;


const lat =
minLat +
Math.random() *
(maxLat-minLat);



const lng =
minLng +
Math.random() *
(maxLng-minLng);



if(pointInside(lat,lng)){


students.push({

student_id:
students.length+1,


lat:
Number(lat.toFixed(6)),


lng:
Number(lng.toFixed(6)),


zip_code:
"75035"


});


}


}



fs.writeFileSync(

"public/students.json",

JSON.stringify(
students,
null,
2
)

);



console.log(
"Generated",
students.length,
"students"
);