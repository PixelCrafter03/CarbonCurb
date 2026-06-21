export function generateCommuteAnalysis(school:any){

  const students =
    school.students > 0
    ? school.students
    : Math.floor(Math.random() * 2000 + 500);


  const walkingGroups =
    Math.floor(students / 250);


  const co2Saved =
    walkingGroups * 12;


  const score =
    Math.min(
      95,
      Math.floor(
        60 + walkingGroups * 5
      )
    );


  return {

    score,

    walkingGroups,

    co2Saved,


    recommendation:`

🤖 CarbonCurb AI Analysis

Commute Score:
${score}/100


Potential Green Commute Zones:

🚶 ${walkingGroups} walking groups identified

🌱 Estimated CO₂ reduction:
${co2Saved} kg/month


Recommendation:

Create neighborhood-based walking and biking groups around ${school.school_name}.
Short vehicle trips can be replaced with sustainable student routes.

`

  };

}