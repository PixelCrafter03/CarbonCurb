"use client";

import { useEffect, useState } from "react";
import CarbonMap from "@/components/CarbonMap";
import { supabase } from "@/lib/supabase";


export default function Home() {

  const [schools, setSchools] = useState<any[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);



  useEffect(() => {

    async function loadSchools() {


      const { data, error } = await supabase
        .from("schools")
        .select("*");



      if (error) {

        console.error(
          "Supabase error:",
          error
        );

        setLoading(false);

        return;

      }



      console.log(
        "Schools loaded:",
        data
      );


      setSchools(data || []);



      if (data && data.length > 0) {

        setSelectedSchool(data[0]);

      }


      setLoading(false);


    }


    loadSchools();


  }, []);




  const filteredSchools = schools.filter(
    (school) =>

      school.school_name
        .toLowerCase()
        .includes(search.toLowerCase())

  );





  function selectSchool(school:any) {

    setSelectedSchool(school);

    setSearch("");

  }






  if (loading) {

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





      {/* School Search */}



      <div className="bg-white rounded-xl shadow p-6 mb-8">


        <h2 className="text-2xl font-bold mb-4">

          Find Your School

        </h2>




        <input


          className="w-full border rounded-lg p-3"


          placeholder="Search any US school..."


          value={search}


          onChange={(e)=>
            setSearch(e.target.value)
          }


        />





        {search.length > 0 && (


          <div className="mt-4 space-y-2">



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


                🏫 {school.school_name}


                <br />


                <span className="text-sm">


                  {school.city}, {school.state}


                </span>



              </button>



            ))}



          </div>


        )}



      </div>








      {selectedSchool && (


        <>





        {/* Dashboard Cards */}



        <div className="grid md:grid-cols-3 gap-4 mb-8">



          <div className="bg-white rounded-xl shadow p-6">


            <h2 className="font-bold">

              School

            </h2>


            <p className="text-xl mt-2">

              {selectedSchool.school_name}

            </p>


          </div>






          <div className="bg-white rounded-xl shadow p-6">


            <h2 className="font-bold">

              Students

            </h2>


            <p className="text-3xl mt-2">

              {selectedSchool.students}

            </p>


          </div>







          <div className="bg-white rounded-xl shadow p-6">


            <h2 className="font-bold">

              CO₂ Saved

            </h2>


            <p className="text-3xl mt-2">

              {selectedSchool.co2_saved} kg

            </p>


          </div>




        </div>








        {/* Map */}



        <CarbonMap

          routes={[
            selectedSchool
          ]}

        />








        {/* AI Recommendation */}



        <div className="bg-white rounded-xl shadow p-6 mt-8">


          <h2 className="text-2xl font-bold text-green-700">


            🤖 AI Route Recommendation


          </h2>




          <p className="mt-4 whitespace-pre-wrap">


            {selectedSchool.ai_recommendation}


          </p>



        </div>






        </>

      )}





    </main>

  );


}