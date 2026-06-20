"use client";

import { useEffect, useState } from "react";
import CarbonMap from "@/components/CarbonMap";

export default function Home() {
  const [schools, setSchools] = useState<any[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    async function loadSchools() {

      try {

        const response = await fetch("/us_schools.json");

        const data = await response.json();


        console.log(
          "Loaded schools:",
          data.length
        );


        setSchools(data);


      } catch (error) {

        console.error(
          "Failed to load schools:",
          error
        );

      }


      setLoading(false);

    }


    loadSchools();


  }, []);



  const filteredSchools = schools
    .filter((school) => {

      if (!search.trim()) return false;


      const query = search.toLowerCase();


      return (

        school.school_name
          ?.toLowerCase()
          .includes(query)

        ||

        school.district
          ?.toLowerCase()
          .includes(query)

        ||

        school.city
          ?.toLowerCase()
          .includes(query)

        ||

        school.state
          ?.toLowerCase()
          .includes(query)

      );


    })
    .slice(0,50);



  async function selectSchool(school:any){


    if(school.lat === 0 || school.lng === 0){


      try{


        const response = await fetch("/api/geocode",{

          method:"POST",

          headers:{
            "Content-Type":"application/json"
          },

          body:JSON.stringify({

            name:
            school.school_name
            ?.replace(" H S"," High School")
            ?.replace(" MIDDLE"," Middle School")
            ?.replace(" EL"," Elementary School"),

            city:school.city,

            state:school.state

          })


        });



        const coords = await response.json();



        school.lat = coords.lat;

        school.lng = coords.lng;



      }

      catch(error){

        console.error(
          "Geocoding failed:",
          error
        );

      }


    }



    setSelectedSchool({...school});


    setSearch("");

}



  if(loading){

    return (

      <main className="min-h-screen bg-green-50 p-8">

        <h1 className="text-4xl font-bold text-green-800">

          Loading CarbonCurb 🌱

        </h1>

      </main>

    );

  }





  return (

    <main className="min-h-screen bg-green-50 p-8">


      <h1 className="text-5xl font-bold text-green-800 mb-4">

        CarbonCurb 🌱

      </h1>



      <p className="text-lg text-gray-700 mb-8">

        AI-powered sustainable school commute planning across the United States.

      </p>





      <div className="bg-white rounded-xl shadow p-6 mb-8">


        <h2 className="text-2xl font-bold mb-4 text-green-800">

          Find Your School

        </h2>



        <input

          className="w-full border rounded-lg p-3 text-black"
          placeholder="Search school, district, city, or state..."

          value={search}

          onChange={(e)=>
            setSearch(e.target.value)
          }

        />




        {search.length > 0 && (

          <div className="mt-4 max-h-96 overflow-y-auto space-y-2">


            {filteredSchools.length === 0 && (

              <p className="text-gray-500">

                No schools found

              </p>

            )}



            {filteredSchools.map((school,index)=>(


              <button

                key={index}

                onClick={()=>
                  selectSchool(school)
                }

                className="w-full text-left bg-green-100 hover:bg-green-200 p-4 rounded-lg"


              >


                <div className="font-bold">

                  {school.school_name
                    ?.replace(" H S", " High School")
                    ?.replace(" MIDDLE", " Middle School")
                    ?.replace(" EL", " Elementary School")}

                </div>



                <div className="text-sm text-gray-700">

                  {school.district}

                </div>



                <div className="text-sm text-gray-500">

                  {school.city}, {school.state}

                </div>



              </button>


            ))}


          </div>


        )}


      </div>





      {selectedSchool && (

        <>


        <div className="grid md:grid-cols-3 gap-4 mb-8">



          <div className="bg-white rounded-xl shadow p-6 text-gray-900">

            <h2 className="font-bold">

              School

            </h2>


            <p className="text-xl mt-2">

              {selectedSchool.school_name
              ?.replace(" H S"," High School")
              ?.replace(" MIDDLE"," Middle School")
              ?.replace(" EL"," Elementary School")}

            </p>


          </div>





          <div className="bg-white rounded-xl shadow p-6 text-gray-900">

            <h2 className="font-bold">

              District

            </h2>


            <p className="mt-2">

              {selectedSchool.district}

            </p>


          </div>





          <div className="bg-white rounded-xl shadow p-6 text-gray-900">

            <h2 className="font-bold">

              Students

            </h2>


            <p className="text-3xl mt-2">

              {selectedSchool.students && selectedSchool.students > 0
              ? selectedSchool.students.toLocaleString()
              : "Estimated data unavailable"}

            </p>


          </div>


        </div>





        {
          selectedSchool.lat !== 0 &&
          selectedSchool.lng !== 0 &&

          <CarbonMap

            routes={[selectedSchool]}

          />

        }






        <div className="bg-white rounded-xl shadow p-6 mt-8">


          <h2 className="text-2xl font-bold text-green-700">

            🤖 AI Commute Recommendation

          </h2>



          <p className="mt-4 whitespace-pre-wrap">

            {selectedSchool.ai_recommendation 
            || 
            `
          • Create supervised walking groups near ${selectedSchool.school_name}.
          • Encourage bike and walking routes within the school zone.
          • Estimated commute emissions can be reduced by shifting short car trips.
          `
          }

          </p>



        </div>



        </>


      )}


    </main>

  );

}