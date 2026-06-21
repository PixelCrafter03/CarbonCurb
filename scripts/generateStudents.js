const fs = require("fs");

const zipCenters = {
  "75034": { lat: 33.150, lng: -96.840 },
  "75035": { lat: 33.160, lng: -96.760 },
  "75036": { lat: 33.140, lng: -96.900 },
  "75068": { lat: 33.120, lng: -96.950 },
  "75069": { lat: 33.197, lng: -96.615 },
  "75070": { lat: 33.170, lng: -96.680 },
  "75071": { lat: 33.250, lng: -96.680 },
  "75072": { lat: 33.190, lng: -96.730 }
};

const zips = Object.keys(zipCenters);

const students = [];

for (let i = 1; i <= 100; i++) {
  const zip =
    zips[Math.floor(Math.random() * zips.length)];

  const center = zipCenters[zip];

  students.push({
    student_id: i,
    zip_code: zip,
    lat:
      center.lat +
      (Math.random() - 0.5) * 0.02,
    lng:
      center.lng +
      (Math.random() - 0.5) * 0.02
  });
}

fs.writeFileSync(
  "public/students.json",
  JSON.stringify(students, null, 2)
);

console.log("Generated 100 students.");