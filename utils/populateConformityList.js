const conformityList = require("./conformityList.json");
const fs = require("fs");

const main = async () => {
  const missingCities = [];
  const response = await fetch(
    "https://unpkg.com/codes-postaux@4.0.0/codes-postaux.json",
  );
  const data = await response.json();

  conformityList.forEach((cityWithoutName) => {
    const city = data.find(
      (city) => city.codeCommune === cityWithoutName.code_commune,
    );
    if (!city) {
      missingCities.push(cityWithoutName.code_commune);
      return;
    }
    cityWithoutName.name = city.nomCommune;
    cityWithoutName.code_postal = city.codePostal;
  });
  console.log(conformityList.length, "cities");
  console.log(missingCities.length, "missing cities", missingCities);

  // 9 cities are missing from the list of cities with conformity data, i have added them manually in the json file.

  fs.writeFileSync(
    "conformityList.json",
    JSON.stringify(conformityList, null, 2),
  );
};

main().catch((err) => console.error(err));
