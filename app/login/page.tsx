"use client";

import {useState} from "react";

import {
signInWithEmailAndPassword
}
from "firebase/auth";

import {auth} from "@/lib/firebase";



export default function Login(){


const [email,setEmail]=useState("");

const [password,setPassword]=useState("");




async function login(){


await signInWithEmailAndPassword(

auth,

email,

password

);


window.location.href="/dashboard";


}




return (

<div className="p-10">


<h1 className="text-4xl font-bold">

CarbonCurb Login 🌱

</h1>



<input

className="border p-3 mt-5"

placeholder="Email"

onChange={
e=>setEmail(e.target.value)
}

/>



<input

className="border p-3 mt-3"

placeholder="Password"

type="password"

onChange={
e=>setPassword(e.target.value)
}

/>




<button

className="
bg-green-700
text-white
p-3
rounded
mt-5
"

onClick={login}

>

Login

</button>



</div>

)


}