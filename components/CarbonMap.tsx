"use client";

import React, {useEffect,useState} from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  CircleMarker
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import L from "leaflet";





delete (L.Icon.Default.prototype as any)._getIconUrl;



L.Icon.Default.mergeOptions({

iconRetinaUrl:
"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

iconUrl:
"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

shadowUrl:
"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png"

});







const COLORS = [

"#16a34a",
"#2563eb",
"#9333ea",
"#ea580c",
"#dc2626",
"#0891b2",
"#ca8a04",
"#db2777"

];







export default function CarbonMap({

school,

groups=[],

students=[]

}:any){



const [routes,setRoutes]=useState<any[]>([]);

const [mounted,setMounted]=useState(false);







useEffect(()=>{

setMounted(true);


return()=>setMounted(false);


},[]);








useEffect(()=>{



async function createRoutes(){



const built:any[]=[];




for(
const [index,group]
of groups.entries()

){



const members = group;



if(!members || members.length===0)

continue;







const hubLat =

members.reduce(

(sum:number,s:any)=>

sum+Number(s.lat)

,0)

/members.length;






const hubLng =

members.reduce(

(sum:number,s:any)=>

sum+Number(s.lng)

,0)

/members.length;










const url =

`https://router.project-osrm.org/route/v1/foot/${hubLng},${hubLat};${school.lng},${school.lat}?overview=full&geometries=geojson`;







try{


const res = await fetch(url);

const data = await res.json();





if(data.routes?.length){


built[index]=


data.routes[0]

.geometry

.coordinates

.map((p:any)=>[

p[1],
p[0]

]);



}



}

catch(e){

console.log("route error",e);

}



}




setRoutes(built);



}





if(
school &&
groups.length
)

createRoutes();



},[groups,school]);









if(!mounted || !school)

return null;









return(



<div className="rounded-2xl overflow-hidden shadow-xl">



<MapContainer



key={`${school.lat}-${school.lng}`}



center={[

Number(school.lat),

Number(school.lng)

]}



zoom={13}



style={{

height:"650px",

width:"100%"

}}



>






<TileLayer


url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"


/>









{/* LEGEND */}



<div

className="absolute top-5 right-5 bg-white p-5 rounded-xl shadow-lg z-[1000]"

>


<h3 className="font-bold text-lg">

CarbonCurb AI Map

</h3>


<p>
🟢 School
</p>


<p>
🔵 Student Homes
</p>


<p>
🟣 AI Walking Hubs
</p>


<p>
🌈 AI Optimized Routes
</p>


</div>









{/* SCHOOL */}



<Marker

position={[

Number(school.lat),

Number(school.lng)

]}

>


<Popup>


<b>{school.school_name}</b>

<br/>

School

</Popup>


</Marker>













{/* STUDENTS */}



{

students.map(

(student:any,i:number)=>(



<CircleMarker


key={i}



center={[

Number(student.lat),

Number(student.lng)

]}



radius={7}



pathOptions={{

color:"#2563eb",

fillColor:"#60a5fa",

fillOpacity:.85

}}

>



<Popup>

Student Home

<br/>

ZIP:
{student.zip_code}

</Popup>



</CircleMarker>



)

)

}













{/* GROUPS */}



{

groups.map(

([type,members]:any,index:number)=>{



if(!members?.length)

return null;






const color = COLORS[index % COLORS.length];





const hubLat =

members.reduce(

(sum:number,s:any)=>

sum+Number(s.lat)

,0)

/members.length;






const hubLng =

members.reduce(

(sum:number,s:any)=>

sum+Number(s.lng)

,0)

/members.length;







return(



<React.Fragment

key={index}

>







{/* AI HUB */}



<CircleMarker



center={[

hubLat,

hubLng

]}



radius={18}



pathOptions={{

color,

fillColor:color,

fillOpacity:.75

}}

>



<Popup>



<b>

AI Walking Hub #{index+1}

</b>


<br/>


Type:

{type}


<br/>


Students:

{members.length}



</Popup>



</CircleMarker>










{/* HOME TO HUB */}



{

members.map(

(student:any,j:number)=>(


<Polyline


key={j}


positions={[



[

Number(student.lat),

Number(student.lng)

],



[

hubLat,

hubLng

]



]}



pathOptions={{


color:"#94a3b8",

weight:2

}}



/>



)

)

}









{/* ANIMATED ROUTE */}



{

routes[index] &&


<Polyline



positions={routes[index]}



pathOptions={{



color,



weight:6,


opacity:.9,



className:

"route-animation"



}}



/>



}







</React.Fragment>



)


}


)

}









</MapContainer>





<style jsx global>{`


.route-animation{


stroke-dasharray:12;

animation:

dash 2s linear infinite;


}



@keyframes dash{


from{

stroke-dashoffset:40;

}


to{

stroke-dashoffset:0;

}



}


`}</style>





</div>



)


}