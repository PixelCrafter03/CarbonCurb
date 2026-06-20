const fs = require("fs");
const csv = require("csv-parser");


const schools = [];


fs.createReadStream(
  "data/ccd_sch_029_2425_w_1a_072025.csv"
)

.pipe(csv())


.on("data", (row)=>{


  schools.push({

    school_id:
      row.SCH_ID || "",


    school_name:
      row.SCH_NAME || "Unknown",


    district:
      row.LEA_NAME || "",


    city:
      row.LCITY || "",


    state:
      row.ST || "",


    lat:
      Number(row.LAT) || 0,


    lng:
      Number(row.LON) || 0,


    students:
      Number(row.ENR_TOTAL) || 0,


    co2_saved:
      0,


    ai_recommendation:
      "AI commute analysis pending."

  });


})


.on("end", ()=>{


  fs.writeFileSync(

    "data/carboncurb_schools.json",

    JSON.stringify(
      schools,
      null,
      2
    )

  );


  console.log(
    "Converted schools:",
    schools.length
  );


});