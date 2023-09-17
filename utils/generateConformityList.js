// Description: Script to generate a list of communes with conformity status for the year 2022
// run this script and then populateConformityList to add names and postal codes.

const fs = require("fs");
const departements = require("./departements-region.json");

let results = [];

const getResults = async (address) => {
  let response = await fetch(address);
  let data = await response.json();
  console.log(data.next);
  console.log(data.count);
  results.push(...data.data);

  while (data.next !== null) {
    response = await fetch(data.next);
    data = await response.json();
    results.push(...data.data);
    console.log(data.next);
    console.log(data.count);
  }
};

const main = async () => {
  for (const departement of departements) {
    const codeDepartement = departement.num_dep;
    const address = `https://hubeau.eaufrance.fr/api/v1/qualite_eau_potable/resultats_dis?code_departement=${codeDepartement}&date_max_prelevement=2022-12-31&date_min_prelevement=2022-01-01&fields=code_commune%2Ccode_departement%2Cconformite_references_bact_prelevement%2Cconformite_references_pc_prelevement&size=20000`;
    console.log("fetching results for departement ", codeDepartement);
    await getResults(address);
  }

  const aggregatedResults = {};

  for (const result of results) {
    const {
      code_departement,
      code_commune,
      conformite_references_bact_prelevement,
      conformite_references_pc_prelevement,
    } = result;

    if (!aggregatedResults[code_commune]) {
      aggregatedResults[code_commune] = {
        code_departement,
        code_commune,
        conformity: "C",
      };
    }

    if (
      conformite_references_bact_prelevement !== "C" ||
      conformite_references_pc_prelevement !== "C"
    ) {
      aggregatedResults[code_commune].conformity = "N";
    }
  }

  const finalResults = Object.values(aggregatedResults);

  fs.writeFileSync(
    "conformityList.json",
    JSON.stringify(finalResults, null, 2),
  );

  console.log("Completed!");
};

main().catch((err) => console.error(err));
