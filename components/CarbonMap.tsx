"use client";

import React, { useEffect, useState } from "react";

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





export default function CarbonMap({

school,

groups=[],

students=[]

}:any){

const [routes,setRoutes] = useState<any[]>([]);

if(!school)

return null;




useEffect(()=>{


return ()=>{


const containers =
document.querySelectorAll(".leaflet-container");


containers.forEach((container:any)=>{


if(container._leaflet_id){

delete container._leaflet_id;

}


});


};


},[]);


useEffect(()=>{


async function buildRoutes(){


const newRoutes:any[] = [];



for(const [zip,members] of groups){


if(!members || members.length===0)

continue;



const hubLat =

members.reduce(

(sum:number,s:any)=>

sum + Number(s.lat),

0

)/members.length;




const hubLng =

members.reduce(

(sum:number,s:any)=>

sum + Number(s.lng),

0

)/members.length;






const url =

`https://router.project-osrm.org/route/v1/foot/${hubLng},${hubLat};${school.lng},${school.lat}?overview=full&geometries=geojson`;




try{


const response =
await fetch(url);



const data =
await response.json();




if(data.routes?.length){


newRoutes.push(

data.routes[0]
.geometry
.coordinates
.map(

(point:any)=>

[

point[1],

point[0]

]

)

);



}



}

catch(error){

console.log(error);

}



}




setRoutes(newRoutes);



}



if(groups.length > 0)

buildRoutes();



},[groups,school]);



return (

<div className="rounded-xl overflow-hidden shadow">



<MapContainer


center={[

school.lat,

school.lng

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









{/* SCHOOL */}


<Marker


position={[

school.lat,

school.lng

]}



>


<Popup>


<b>

{school.school_name}

</b>


<br/>

School


</Popup>



</Marker>









{/* STUDENTS */}





{

students.map(

(student:any)=>(


<CircleMarker


key={

student.student_id

}


center={[

student.lat,

student.lng

]}


radius={7}


>


<Popup>


Student #{student.student_id}


<br/>


ZIP:

{student.zip_code}



</Popup>


</CircleMarker>


)

)



}









{/* GROUP ROUTES */}





{


groups.map(

([zip,members]:any,index:number)=>{



if(!members || members.length===0)

return null;





const hubLat =


members.reduce(

(sum:number,s:any)=>

sum + Number(s.lat),

0

)


/

members.length;






const hubLng =


members.reduce(

(sum:number,s:any)=>

sum + Number(s.lng),

0

)


/

members.length;






return (


<React.Fragment

key={

"cluster-"+index

}

>




<CircleMarker



center={[

hubLat,

hubLng

]}



radius={12}


>



<Popup>


<b>

AI Walking Hub

</b>


<br/>


ZIP:

{zip}


<br/>


Students:

{members.length}



</Popup>



</CircleMarker>








{

members.map(

(student:any)=>(



<Polyline


key={

"student-route-"+student.student_id

}



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



/>



)

)



}








{

routes[index] &&


<Polyline


key={

"route-"+index

}


positions={routes[index]}



/>


}






</React.Fragment>



)

}



)



}





</MapContainer>



</div>


);


}