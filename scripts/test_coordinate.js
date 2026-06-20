const NodeGeocoder = require("node-geocoder");

const geocoder = NodeGeocoder({
  provider: "openstreetmap"
});

async function test(){

const result = await geocoder.geocode(
"Heritage High School, Frisco, Texas"
);

console.log(result);

}

test();