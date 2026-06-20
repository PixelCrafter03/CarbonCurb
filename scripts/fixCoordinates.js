const fs = require("fs");

const schools = require("../public/us_schools.json");

async function geocode(city, state){

  const url =
    `https://nominatim.openstreetmap.org/search?city=${city}&state=${state}&country=USA&format=json&limit=1`;


  const res = await fetch(url,{
    headers:{
      "User-Agent":"CarbonCurb"
    }
  });


  const data = await res.json();


  if(data.length){

    return {
      lat:Number(data[0].lat),
      lng:Number(data[0].lon)
    };

  }


  return {
    lat:0,
    lng:0
  };

}



async function run(){

  for(let i=0;i<schools.length;i++){

    const s = schools[i];


    if(s.lat===0 && s.city && s.state){

      const coords =
        await geocode(
          s.city,
          s.state
        );


      s.lat = coords.lat;

      s.lng = coords.lng;


      console.log(
        i,
        s.school_name,
        coords
      );


      await new Promise(r=>setTimeout(r,1000));

    }

  }


  fs.writeFileSync(
    "public/us_schools.json",
    JSON.stringify(schools,null,2)
  );


}


run();