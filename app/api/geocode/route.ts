import { NextResponse } from "next/server";


export async function POST(req:Request){


  const body = await req.json();


  const query =
  `${body.name}, ${body.city}, ${body.state}`;



  const response = await fetch(

    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,

    {
      headers:{
        "User-Agent":"CarbonCurb"
      }
    }

  );


  const data = await response.json();



  if(data.length === 0){

    return NextResponse.json({

      lat:0,

      lng:0

    });

  }



  return NextResponse.json({

    lat:Number(data[0].lat),

    lng:Number(data[0].lon)

  });


}