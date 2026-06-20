"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";


const icon = L.icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


export default function CarbonMap({routes}:any){


  const school = routes[0];


  if(
    !school ||
    school.lat === 0 ||
    school.lng === 0
  ){

    return (

      <div className="bg-white rounded-xl shadow p-6">

        No map location available for this school.

      </div>

    );

  }



  return (

    <div className="h-[500px] rounded-xl overflow-hidden shadow">


      <MapContainer

        center={[
          school.lat,
          school.lng
        ]}

        zoom={14}

        style={{
          height:"100%",
          width:"100%"
        }}

      >


        <TileLayer

          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"

          attribution="© OpenStreetMap"

        />



        <Marker

          position={[
            school.lat,
            school.lng
          ]}

          icon={icon}

        >

          <Popup>

            <b>
              {school.school_name}
            </b>

            <br/>

            {school.district}

          </Popup>


        </Marker>


      </MapContainer>


    </div>

  );

}