const fs = require("fs");
const NodeGeocoder = require("node-geocoder");

const geocoder = NodeGeocoder({
  provider: "openstreetmap"
});

const schools = require("../public/us_schools.json");


function cleanSchoolName(name){

  return name
    .replace(" H S", " High School")
    .replace(" MIDDLE", " Middle School")
    .replace(" EL", " Elementary School");

}


async function updateSchools(){

  let count = 0;

  for (let school of schools){

    if(school.lat === 0 || school.lng === 0){

      const searchName = cleanSchoolName(
        school.school_name
      );


      try{

        const results = await geocoder.geocode(
          `${searchName}, ${school.city}, ${school.state}`
        );


        if(results.length > 0){

          school.lat = results[0].latitude;
          school.lng = results[0].longitude;

          console.log(
            "✅ Updated:",
            school.school_name,
            school.lat,
            school.lng
          );

          count++;

        }
        else{

          console.log(
            "❌ Not found:",
            school.school_name
          );

        }


      }
      catch(error){

        console.log(
          "ERROR:",
          school.school_name
        );

      }


      // avoid rate limit
      await new Promise(
        resolve => setTimeout(resolve,1000)
      );

    }

  }


  fs.writeFileSync(
    "./public/us_schools.json",
    JSON.stringify(
      schools,
      null,
      2
    )
  );


  console.log(
    `DONE - Updated ${count} schools`
  );

}


updateSchools();