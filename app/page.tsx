"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";


const CarbonMap = dynamic(
  () => import("@/components/CarbonMap"),
  {
    ssr:false
  }
);



export default function Home(){


const [schools,setSchools] = useState<any[]>([]);

const [students,setStudents] = useState<any[]>([]);

const [clusters,setClusters] = useState<any[]>([]);


const [search,setSearch] = useState("");

const [selectedSchool,setSelectedSchool] = useState<any>(null);

const [loading,setLoading] = useState(true);





useEffect(()=>{


async function loadData(){


try{


const schoolData =
await fetch("/texas_schools.json")
.then(r=>r.json());


const studentData =
await fetch("/students.json")
.then(r=>r.json());


let clusterData=[];


try{

clusterData =
await fetch("/clusters.json")
.then(r=>r.json());

}

catch{

clusterData=[];

}




setSchools(schoolData);

setStudents(studentData);

setClusters(clusterData);



}

catch(error){

console.error(error);

}


setLoading(false);


}



loadData();



},[]);









const filteredSchools =

schools.filter((school)=>{


if(!search.trim())
return false;


const q =
search.toLowerCase();



return (

school.school_name
?.toLowerCase()
.includes(q)


||

school.district
?.toLowerCase()
.includes(q)


||

school.city
?.toLowerCase()
.includes(q)


);


})

.slice(0,15);









function selectSchool(school:any){


setSelectedSchool(school);

setSearch(school.school_name);


}









function distance(

lat1:number,
lng1:number,
lat2:number,
lng2:number

){


const x =
(lat2-lat1)*69;


const y =
(lng2-lng1)*54;


return Math.sqrt(
x*x+y*y
);


}









function generateGroups(){


if(!selectedSchool)

return [];



const groups:any = {};



students.forEach((student)=>{


const d = distance(

student.lat,

student.lng,

Number(selectedSchool.lat),

Number(selectedSchool.lng)

);



if(d <= 2){



if(!groups[student.zip_code])

groups[student.zip_code]=[];



groups[student.zip_code]
.push(student);



}



});



return Object.entries(groups)

.filter(
([zip,list]:any)=>

list.length >=3

);



}









const commuteGroups =
generateGroups();






const nearbyStudents =

commuteGroups.flatMap(

([zip,list]:any)=>

list

);






const carbonSaved =


nearbyStudents.length *

2 *

5 *

0.404;










if(loading){


return (

<main className="p-10">


<h1 className="text-4xl font-bold text-green-800">

Loading CarbonCurb 🌱

</h1>


</main>


);


}









return (



<main className="min-h-screen bg-green-50 p-8">







<h1 className="text-5xl font-bold text-green-900">

CarbonCurb 🌱

</h1>


<p className="mt-3 mb-8 text-gray-700 text-lg">

AI-powered sustainable school commute planning

</p>









{/* METRICS */}



<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">



<div className="bg-white rounded-xl shadow p-6 border">

<h3 className="font-semibold text-gray-700">

Students Analyzed

</h3>


<p className="text-4xl font-bold text-green-800 mt-2">

{students.length}

</p>


<p className="text-gray-600">

AI processed locations

</p>

</div>






<div className="bg-white rounded-xl shadow p-6 border">

<h3 className="font-semibold text-gray-700">

Walking Groups

</h3>


<p className="text-4xl font-bold text-green-800 mt-2">

{commuteGroups.length}

</p>


<p className="text-gray-600">

Generated commute hubs

</p>

</div>







<div className="bg-white rounded-xl shadow p-6 border">

<h3 className="font-semibold text-gray-700">

CO₂ Saved Weekly

</h3>


<p className="text-4xl font-bold text-green-800 mt-2">

{carbonSaved.toFixed(1)} kg

</p>


<p className="text-gray-600">

Estimated reduction

</p>

</div>




</div>









{/* SEARCH */}




<div className="bg-white rounded-xl shadow p-6">



<h2 className="text-2xl font-bold text-green-900">

Find Your School

</h2>



<input


className="
w-full
border
rounded-lg
p-3
mt-4
text-black
"


placeholder="Search school..."


value={search}


onChange={(e)=>

setSearch(e.target.value)

}



/>




{

search && !selectedSchool && (



<div className="mt-4 space-y-3">


{

filteredSchools.map(

(school,index)=>(


<button


key={index}


className="
w-full
text-left
bg-green-100
hover:bg-green-200
rounded-lg
p-4
text-gray-900
"


onClick={()=>selectSchool(school)}


>


<b>

{school.school_name}

</b>


<br/>

{school.district}


<br/>

{school.city}, {school.state}



</button>


)

)


}


</div>


)



}





{

selectedSchool &&

<button

className="
mt-3
font-semibold
text-red-700
"

onClick={()=>{

setSelectedSchool(null);

setSearch("");

}}


>

✕ Clear School

</button>


}





</div>













{

selectedSchool && (



<>









<div className="mt-8 bg-white rounded-xl shadow p-6">


<h2 className="text-3xl font-bold text-green-900">

{selectedSchool.school_name}

</h2>



<p className="text-gray-700">

{selectedSchool.city},

{selectedSchool.state}

</p>









<h3 className="mt-8 text-2xl font-bold text-green-900">

🚶 AI Walking Groups

</h3>





<div className="grid md:grid-cols-2 gap-5 mt-4">



{

commuteGroups.map(

([zip,list]:any,index)=>(



<div

key={index}

className="
bg-green-100
rounded-xl
p-5
text-gray-900
border
"


>



<h4 className="text-xl font-bold text-green-900">

Group {index+1}

</h4>


<p className="mt-2 font-semibold">

ZIP: {zip}

</p>


<p className="font-semibold">

Students: {list.length}

</p>



<p className="text-gray-700 mt-2">

AI walking hub created

</p>



</div>



)


)


}



</div>









<h3 className="mt-8 text-2xl font-bold text-green-900">

🤖 AI Emission Zones

</h3>







<div className="space-y-4 mt-4">



{

clusters.slice(0,5).map(

(zone,index)=>{


const badge =

zone.risk_level==="High"

?

"bg-red-200 text-red-900"

:

zone.risk_level==="Medium"

?

"bg-yellow-200 text-yellow-900"

:

"bg-green-200 text-green-900";





return (

<div

key={index}

className="
bg-green-100
rounded-xl
p-5
flex
justify-between
items-center
text-gray-900
"


>


<div>


<h4 className="font-bold text-lg">

{zone.location}

</h4>


<p>

CO₂ Impact:

<b>

{zone.estimated_co2}

</b>


</p>


</div>




<div

className={`px-4 py-2 rounded-full font-bold ${badge}`}

>

{zone.risk_level}

</div>




</div>


)



}


)

}


</div>





</div>









<div className="mt-8 bg-white rounded-xl shadow p-5">


<h2 className="text-2xl font-bold text-green-900 mb-4">

AI Commute Map

</h2>



<CarbonMap


school={{

...selectedSchool,

lat:Number(selectedSchool.lat),

lng:Number(selectedSchool.lng)

}}



groups={commuteGroups}



students={nearbyStudents}



/>



</div>







</>

)



}






</main>


);


}