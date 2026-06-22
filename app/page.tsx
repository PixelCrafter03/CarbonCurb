"use client";

import {useEffect,useState} from "react";
import dynamic from "next/dynamic";


const CarbonMap = dynamic(
()=>import("@/components/CarbonMap"),
{
ssr:false
}
);



export default function Home(){


const [schools,setSchools]=useState<any[]>([]);
const [students,setStudents]=useState<any[]>([]);

const [selectedSchool,setSelectedSchool]=useState<any>(null);

const [searchQuery,setSearchQuery]=useState("");

const [showDropdown,setShowDropdown]=useState(false);

const [loading,setLoading]=useState(true);






useEffect(()=>{


async function load(){


try{


const raw =
await fetch("/texas_schools.json")
.then(r=>r.json());


const schoolData =
(raw.schools || raw)
.filter((s:any)=>s.school_name);



const studentData =
await fetch("/students.json")
.then(r=>r.json());



setSchools(schoolData);

setStudents(studentData);




const heritage =
schoolData.find((s:any)=>

s.school_name
?.toLowerCase()
.includes("heritage")

);



if(heritage){

setSelectedSchool(heritage);

setSearchQuery(
heritage.school_name
);

}



setTimeout(()=>{

setLoading(false);

},1500);



}

catch(e){

console.log(e);

setLoading(false);

}


}


load();


},[]);









function distance(
lat1:number,
lng1:number,
lat2:number,
lng2:number
){


const R=3958.8;


const dLat=(lat2-lat1)*Math.PI/180;

const dLng=(lng2-lng1)*Math.PI/180;



const a=

Math.sin(dLat/2)**2+

Math.cos(lat1*Math.PI/180)

*

Math.cos(lat2*Math.PI/180)

*

Math.sin(dLng/2)**2;



return R*2*Math.atan2(
Math.sqrt(a),
Math.sqrt(1-a)
);


}









function generateGroups(){


if(!selectedSchool)
return [];



const groups:any[]=[];

const used=new Set();



const MAX_GROUP=7;

const RANGE=0.20;



const sorted=[...students].sort(

(a,b)=>

distance(
a.lat,
a.lng,
selectedSchool.lat,
selectedSchool.lng
)

-

distance(
b.lat,
b.lng,
selectedSchool.lat,
selectedSchool.lng
)

);






for(const student of sorted){


if(used.has(student.student_id))
continue;




const nearby = sorted.filter((other:any)=>{


if(
used.has(other.student_id)
||
other.student_id===student.student_id
)

return false;



return distance(

student.lat,
student.lng,

other.lat,
other.lng

)<=RANGE;


});





const cluster=[

student,

...nearby.slice(0,MAX_GROUP-1)

];





if(cluster.length < 2)
continue;





cluster.forEach((s:any)=>{

used.add(s.student_id);

});





const avgDistance =

cluster.reduce(

(sum:number,s:any)=>

sum+

distance(

s.lat,
s.lng,

selectedSchool.lat,
selectedSchool.lng

)

,0)

/

cluster.length;





groups.push({

type:"AI Neighborhood Hub",

students:cluster,


distance:avgDistance.toFixed(2),


confidence:

Math.min(

99,

Math.round(

75+

cluster.length*3

)

),


reason:

`${cluster.length} students connected through nearby neighborhoods`

});




}



return groups;


}









const groups = generateGroups();





const mapStudents =
groups.flatMap(
(g:any)=>g.students
);





const beforeCarbon =

mapStudents.reduce(

(total:number,s:any)=>

total+

distance(

s.lat,
s.lng,

selectedSchool?.lat,
selectedSchool?.lng

)

*

2

*

0.404,


0

);





const saved =
beforeCarbon * 0.35;


const afterCarbon =
beforeCarbon-saved;



const reduction =
beforeCarbon
?
Math.round(
(saved/beforeCarbon)*100
)
:
0;









if(loading){


return(

<main className="min-h-screen flex items-center justify-center bg-green-50">


<div className="text-center">


<div className="text-7xl animate-bounce">

🌱

</div>


<h1 className="text-4xl font-bold mt-5 text-green-900">

AI analyzing commute patterns...

</h1>


<p className="mt-3 text-gray-600">

Finding neighborhoods • Building walking groups • Estimating CO₂

</p>


<div className="mt-6 w-80 h-3 bg-green-200 rounded-full overflow-hidden">


<div className="h-full w-2/3 bg-green-600 animate-pulse"/>


</div>


</div>


</main>

)

}









return(


<main className="min-h-screen bg-gradient-to-br from-green-50 to-white p-8">


<h1 className="text-6xl font-black text-green-900">

CarbonCurb 🌱

</h1>


<p className="text-xl text-gray-600 mt-3">

AI-powered sustainable school commute planning

</p>








<div className="grid md:grid-cols-4 gap-6 mt-10">


{[

["Students",students.length],

["AI Groups",groups.length],

["CO₂ Saved",saved.toFixed(1)+" kg"],

["Reduction",reduction+"%"]

].map((x:any,i)=>(


<div

key={i}

className="bg-white shadow-xl rounded-2xl p-6"


>


<p className="text-gray-500">

{x[0]}

</p>


<h2 className="text-4xl font-bold text-green-700">

{x[1]}

</h2>


</div>


))}



</div>









<div className="bg-white shadow-xl rounded-2xl p-8 mt-10">


<h2 className="text-3xl font-bold">

Find Your School

</h2>



<input


className="w-full border rounded-xl p-4 mt-5"

placeholder="Search school..."

value={searchQuery}



onChange={(e)=>{

setSearchQuery(e.target.value);

setShowDropdown(true);

}}


/>




{

showDropdown &&

schools

.filter((s:any)=>

s.school_name

.toLowerCase()

.includes(

searchQuery.toLowerCase()

)

)

.slice(0,5)

.map((s:any)=>(


<button


key={s.school_id}


className="w-full text-left bg-green-100 mt-3 p-4 rounded-xl"


onClick={()=>{

setSelectedSchool(s);

setSearchQuery(s.school_name);

setShowDropdown(false);

}}


>

{s.school_name}

</button>


))


}


</div>









<div className="bg-white shadow-xl rounded-2xl p-8 mt-10">


<h2 className="text-3xl font-bold">

🚶 AI Walking Groups

</h2>



<p className="text-gray-600 mt-2">

CarbonCurb creates small neighborhood walking networks.

</p>





{

groups.slice(0,10).map((g:any,i:number)=>(


<div

key={i}

className="border rounded-xl p-5 mt-5"


>


<h3 className="text-xl font-bold text-green-800">

🚶 Walking Group {i+1}

</h3>


<p>

Students: {g.students.length}

</p>


<p>

AI Confidence: {g.confidence}%

</p>


<p>

Distance: {g.distance} miles

</p>


<p>

{g.reason}

</p>


</div>


))


}


</div>









<div className="bg-white shadow-xl rounded-2xl p-8 mt-10">


<h2 className="text-3xl font-bold">

🤖 AI Carbon Impact

</h2>



<div className="grid md:grid-cols-2 gap-6 mt-6">


<div className="bg-red-50 rounded-xl p-6">

<h3 className="font-bold text-red-700">

Before CarbonCurb 🚗

</h3>


<p className="text-4xl font-bold">

{beforeCarbon.toFixed(1)} kg

</p>


</div>




<div className="bg-green-50 rounded-xl p-6">

<h3 className="font-bold text-green-700">

After CarbonCurb 🌱

</h3>


<p className="text-4xl font-bold">

{afterCarbon.toFixed(1)} kg

</p>


</div>


</div>


</div>









<div className="bg-white shadow-xl rounded-2xl p-8 mt-10">


<h2 className="text-3xl font-bold">

🗺️ AI Commute Map

</h2>



<CarbonMap


school={selectedSchool}


groups={groups.map((g:any)=>[

g.type,

g.students

])}


students={mapStudents}


/>


</div>



</main>


)


}