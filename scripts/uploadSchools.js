const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");


const supabase = createClient(

process.env.NEXT_PUBLIC_SUPABASE_URL,

process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

);



const schools = JSON.parse(

fs.readFileSync(
"data/carboncurb_schools.json",
"utf8"
)

);



async function upload(){


const batchSize = 500;


console.log(
"Total schools:",
schools.length
);



for(
let i = 0;
i < schools.length;
i += batchSize
){



const batch = schools.slice(
i,
i + batchSize
);



const {error}=await supabase

.from("schools")

.insert(batch);



if(error){

console.error(
"Failed batch",
i,
error
);

return;

}



console.log(

`Uploaded ${Math.min(
i + batchSize,
schools.length
)} / ${schools.length}`

);



}



console.log(
"UPLOAD COMPLETE 🚀"
);



}



upload();