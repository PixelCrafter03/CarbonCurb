"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

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


export default function LeafletMap({ routes }: any) {

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-8">

      <h2 className="text-2xl font-bold text-green-700 mb-4">
        🌎 Carbon Impact Map
      </h2>


      <MapContainer
        center={[33.19, -96.65]}
        zoom={12}
        style={{
          height: "450px",
          width: "100%"
        }}
      >

        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />


        {routes
          .filter(
            (route: any) =>
              route.lat !== undefined &&
              route.lng !== undefined
          )
          .map((route: any, index: number) => (

            <Marker
              key={index}
              position={[
                route.lat,
                route.lng
              ]}
              icon={icon}
            >

              <Popup>

                <b>
                  ZIP {route.zip_code}
                </b>

                <br />

                Students: {route.students}

                <br />

                CO₂ Saved: {route.co2_saved} kg

              </Popup>

            </Marker>

          ))}


      </MapContainer>


    </div>
  );
}