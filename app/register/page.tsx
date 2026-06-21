"use client";

import {useState} from "react";


export default function Register(){


const [name,setName]=useState("");

const [role,setRole]=useState("student");

const [school,setSchool]=useState("");

const [zip,setZip]=useState("");

const [transport,setTransport]=useState("walk");




function registerStudent(){


const student = {


student_id:
Date.now(),


name,


role,


school,


zip_code:zip,


transportation_preference:
transport



};




const existing =

JSON.parse(

localStorage.getItem("students") || "[]"

);




existing.push(student);



localStorage.setItem(

"students",

JSON.stringify(existing)

);



alert(

"Student registered successfully!"

);



}





return (

<main className="min-h-screen bg-green-50 p-10">



<h1 className="text-4xl font-bold text-green-800">

CarbonCurb Registration 🌱

</h1>





<div className="bg-white rounded-xl shadow p-6 mt-8 max-w-xl">





<label className="font-bold">

Name

</label>


<input

className="border p-3 w-full mt-2 text-black"

onChange={e=>

setName(e.target.value)

}

/>







<label className="font-bold block mt-5">

Role

</label>


<select

className="border p-3 w-full text-black"

onChange={e=>

setRole(e.target.value)

}


>


<option value="student">

Student

</option>


<option value="parent">

Parent

</option>


<option value="school_admin">

School Administrator

</option>



</select>









<label className="font-bold block mt-5">

School

</label>


<input

className="border p-3 w-full mt-2 text-black"

onChange={e=>

setSchool(e.target.value)

}

/>







<label className="font-bold block mt-5">

ZIP Code

</label>


<input

className="border p-3 w-full mt-2 text-black"

onChange={e=>

setZip(e.target.value)

}

/>









<label className="font-bold block mt-5">

Transportation

</label>


<select

className="border p-3 w-full text-black"

onChange={e=>

setTransport(e.target.value)

}

>


<option value="walk">

Walk

</option>



<option value="bike">

Bike

</option>



<option value="car">

Car

</option>



</select>








<button


className="
bg-green-700
text-white
p-4
rounded-xl
mt-8
w-full
"


onClick={registerStudent}


>


Create CarbonCurb Profile


</button>







</div>




</main>

)



}