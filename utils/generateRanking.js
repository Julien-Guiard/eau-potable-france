// Description: Script to generate a list of communes with rate of conformity among its communes for the year 2022

const fs = require("fs");
const departements = require("./departements-region.json");
const conformityList = require("./conformityList.json");

let results = [];

const main = async () => {
  for (const departement of departements) {
    const codeDepartement = departement.num_dep;
    const departementName = departement.dep_name;
    const departementRegion = departement.region_name;
    console.log(
      "starting departement: " +
        codeDepartement +
        " - " +
        departementName +
        "...",
    );
    let conformCounter = 0;
    let communeCount = 0;
    conformityList.forEach((commune) => {
      if (commune.code_departement === codeDepartement) {
        communeCount++;
        if (commune.conformity === "C") {
          conformCounter++;
        }
      }
    });
    const conformityRate = ((conformCounter / communeCount) * 100).toFixed(3);
    results.push({
      departementName: departementName,
      departement: codeDepartement,
      region: departementRegion,
      conformityRate: conformityRate,
    });
  }
  results.sort((a, b) => {
    return b.conformityRate - a.conformityRate;
  });

  fs.writeFileSync("ranking2022.json", JSON.stringify(results, null, 2));

  console.log("Completed!");
};

main().catch((err) => console.error(err));
