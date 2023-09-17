import conformityList from "@/utils/conformityList.json";
import departementsRegionList from "@/utils/departements-region.json";
import { formatDateToFrenchStandard } from "@/lib/dateFormat";

interface DepartementRegionElement {
  num_dep: string;
  dep_name: string;
  region_name: string;
}

interface ConformityElement {
  code_departement: string;
  code_commune: string;
  conformity: string;
  name: string;
  code_postal: string;
}

// export const getCommuneNames = async (search: string) => {
//   !Some commune names are missing from this link, including Marseille, Paris, Lyon and some others. Some communes are included in here but have no water tests from the api, including Marseille arrondissements and Paris arrondissements, which causes issues.

//   const resultLimit = 20;
//   const response = await fetch(
//     "https://unpkg.com/codes-postaux@4.0.0/codes-postaux.json",
//   );
//   if (!response.ok) {
//     throw new Error(
//       `Failed to fetch data: ${response.status} ${response.statusText}`,
//     );
//   }
//   const data = await response.json();
//   const sortedData = data
//     .filter((item: any) =>
//       item.nomCommune.toLowerCase().includes(search.toLowerCase()),
//     )
//     .sort((a: any, b: any) => {
//       const aName = a.nomCommune.toLowerCase();
//       const bName = b.nomCommune.toLowerCase();
//       const searchLower = search.toLowerCase();

//       const aStartsWith = aName.startsWith(searchLower);
//       const bStartsWith = bName.startsWith(searchLower);

//       if (aStartsWith && bStartsWith) {
//         return 0;
//       }
//       if (aStartsWith) {
//         return -1;
//       }

//       if (bStartsWith) {
//         return 1;
//       }

//       return 0;
//     })
//     .slice(0, resultLimit)
//     .map((item: any) => ({
//       name: `${item.nomCommune}` + " (" + `${item.codePostal}` + ")",
//       codeCommune: item.codeCommune,
//       key:
//         `${item.nomCommune}` +
//         " (" +
//         `${item.codePostal}` +
//         ")" +
//         " (" +
//         `${item.code_commune}` +
//         ")",
//     })); // uses the postal code here because some communes have the same name, but different postal code.

//   return sortedData;
// };

export const getCommunesNamesAlt = async (search: string) => {
  const resultLimit = 20;
  const data = conformityList as any[];
  const sortedData = data
    .filter((item: any) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a: any, b: any) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const searchLower = search.toLowerCase();

      const aStartsWith = aName.startsWith(searchLower);
      const bStartsWith = bName.startsWith(searchLower);

      if (aStartsWith && bStartsWith) {
        return aName.length - bName.length;
      }
      if (aStartsWith) {
        return -1;
      }

      if (bStartsWith) {
        return 1;
      }

      return 0;
    })
    .slice(0, resultLimit)
    .map((item: any) => ({
      name: `${item.name}` + " (" + `${item.code_postal}` + ")",
      codeCommune: item.code_commune,
      key:
        `${item.name}` +
        " (" +
        `${item.code_postal}` +
        ")" +
        " (" +
        `${item.code_commune}` +
        ")",
    })); // uses the postal code here because some communes have the same name, but different postal code.
  return sortedData;
};

export const getCommuneCodeFromPosition = async ({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}) => {
  const response = await fetch(
    `https://wxs.ign.fr/essentiels/geoportail/geocodage/rest/0.1/reverse?lon=${lon}&lat=${lat}&index=address&limit=1&returntruegeometry=false`,
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch data: ${response.status} ${response.statusText}`,
    );
  }
  const data = await response.json();
  return data.features[0].properties.citycode;
};

export const getCommuneFromCode = async (codeCommune: string) => {
  interface Commune {
    name: string;
    departement: string;
    region: string;
  }
  const commune: Commune = {
    name: "",
    departement: "",
    region: "",
  };
  const list = conformityList as ConformityElement[];
  const communeInConformityList = list.find(
    (item: ConformityElement) => item.code_commune === codeCommune,
  );
  if (communeInConformityList) {
    commune.name = communeInConformityList.name;
    await getDepartementRegionFromDepNum(
      communeInConformityList.code_departement,
    ).then((res) => {
      commune.departement = res.departement;
      commune.region = res.region;
    });
  }
  return commune;
};

export const getDepartementRegionFromDepNum = async (num_dep: string) => {
  const list = departementsRegionList as DepartementRegionElement[];
  const departementRegion = list.find(
    (item: DepartementRegionElement) => item.num_dep === num_dep,
  );
  if (departementRegion) {
    return {
      departement: departementRegion.dep_name,
      region: departementRegion.region_name,
    };
  } else {
    return {
      departement: "",
      region: "",
    };
  }
};

export const getLastWaterTestFromCode = async (codeCommune: string) => {
  const response = await fetch(
    `https://hubeau.eaufrance.fr/api/v1/qualite_eau_potable/resultats_dis?code_commune=${codeCommune}&fields=conclusion_conformite_prelevement%2Cconformite_limites_pc_prelevement%2Cconformite_limites_bact_prelevement%2Cconformite_references_pc_prelevement%2Cconformite_references_bact_prelevement%2Cdate_prelevement&size=1`,
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch data: ${response.status} ${response.statusText}`,
    );
  }
  const data = await response.json();
  const responseObject = {
    description: data.data[0].conclusion_conformite_prelevement,
    bactLimit: data.data[0].conformite_limites_bact_prelevement,
    pcLimit: data.data[0].conformite_limites_pc_prelevement,
    bactRef: data.data[0].conformite_references_bact_prelevement,
    pcRef: data.data[0].conformite_references_pc_prelevement,
    date: formatDateToFrenchStandard(data.data[0].date_prelevement),
  };
  return responseObject;
};

export const getConformityList = async (type: string, zone: string) => {
  const list = conformityList as any[];
  const filteredList = list
    .sort((a, b) => (a.name > b.name ? 1 : -1))
    .filter(
      (city) => city.conformity === type && city.code_departement === zone,
    );
  return filteredList;
};

export const getLatestParamTestFromCode = async (
  codeCommune: string,
  param: string,
) => {
  const response = await fetch(
    `https://hubeau.eaufrance.fr/api/v1/qualite_eau_potable/resultats_dis?code_commune=${codeCommune}&code_parametre_se=${param}&fields=code_parametre_se,libelle_parametre,code_lieu_analyse,resultat_numerique,libelle_unite,limite_qualite_parametre,date_prelevement,reference_qualite_parametre,
    &size=1`,
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch data: ${response.status} ${response.statusText}`,
    );
  }
  const data = await response.json();
  if (!data.data[0]) {
    return null;
  }
  return data.data[0];
};

export const getTestCards = async (codeCommune: string) => {
  const paramCodes = ["NO3", "PH", "TH", "TURBNFU", "CDT25"];
  const paramDescriptions: { [key: string]: string } = {
    NO3: "Les nitrates sont des composés chimiques qui peuvent être naturellement présents ou provenir de sources anthropiques comme les engrais et les eaux usées. Des niveaux élevés de nitrates peuvent être dangereux pour la santé humaine et la vie aquatique.",
    PH: "Le pH mesure l'acidité ou l'alcalinité de l'eau. Un pH neutre est 7.0. Des valeurs trop basses ou trop hautes peuvent indiquer une pollution et sont potentiellement nocives pour la vie aquatique.",
    TH: "La dureté de l'eau est principalement due à la présence de minéraux comme le calcium et le magnésium. Une eau dure peut entraîner des dépôts calcaires, mais elle n'est généralement pas dangereuse pour la santé.",
    TURBNFU:
      "La turbidité est une mesure de la clarté de l'eau. Elle peut être causée par des particules en suspension comme de la saleté, des sédiments ou des micro-organismes. Une haute turbidité peut indiquer une pollution et affecter la qualité de l'eau.",
    CDT25:
      "La conductivité mesure la capacité de l'eau à conduire le courant électrique, ce qui est généralement un indicateur de la quantité de ions dissous dans l'eau. Des niveaux élevés peuvent indiquer une contamination par des substances dissoutes.",
  };
  const tests = await Promise.all(
    paramCodes.map((code) => getLatestParamTestFromCode(codeCommune, code)),
  );

  const cards = tests
    .filter((item) => item !== null)
    .map((test) => ({
      title: test.libelle_parametre,
      value: test.resultat_numerique,
      unit: test.libelle_unite,
      limit: test.limite_qualite_parametre,
      reference: test.reference_qualite_parametre,
      testType: test.code_lieu_analyse,
      paramCode: test.code_parametre_se,
      date: formatDateToFrenchStandard(test.date_prelevement),
      description:
        paramDescriptions[
          test.code_parametre_se as keyof typeof paramDescriptions
        ],
    }));

  return cards;
};

export const getNetworksFromCode = async (codeCommune: string) => {
  const resultMap = new Map();

  let nextURL = `https://hubeau.eaufrance.fr/api/v1/qualite_eau_potable/resultats_dis?code_commune=${codeCommune}&date_min_prelevement=2023-01-01&fields=code_reseau%2Cnom_reseau%2Cnom_distributeur%2Cnom_uge%2Cnom_moa%2Cdate_prelevement&size=20000`;

  while (nextURL !== null) {
    const response = await fetch(nextURL);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch data: ${response.status} ${response.statusText}`,
      );
    }
    const data = await response.json();

    data?.data?.forEach((result: any) => {
      result.code_reseau?.forEach((code: string, index: number) => {
        if (!resultMap.has(code)) {
          resultMap.set(code, {
            key: code,
            networkName: result.nom_reseau[index],
            networkCode: code,
            providerName: result.nom_distributeur,
            ugeName: result.nom_uge,
            moaName: result.nom_moa,
            lastTestDate: formatDateToFrenchStandard(result.date_prelevement),
          });
        }
      });
    });

    nextURL = data.next;
  }
  const results = Array.from(resultMap.values());
  return results;
};

export const getCityImageFromName = async (
  name: string,
  departement: string,
) => {
  // this method fetches two times if there are homonyms cities.

  //! utiliser une requête classique wikipedia pour chercher la page de la commune pour éviter des situations comme "roche" ou "poil" https://fr.wikipedia.org/w/api.php?action=query&list=search&srsearch=Commune%20de%20Roche&format=json

  let response = await fetch(
    `https://fr.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&origin=*&titles=${name}`,
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch data: ${response.status} ${response.statusText}`,
    );
  }
  let data = await response.json();
  let wikiImage = data.query.pages[Object.keys(data.query.pages)[0]].original;
  if (wikiImage) return wikiImage.source;

  response = await fetch(
    "https://fr.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&origin=*&titles=" +
      name +
      "_(" +
      departement +
      ")",
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch data: ${response.status} ${response.statusText}`,
    );
  }
  data = await response.json();
  wikiImage = data.query.pages[Object.keys(data.query.pages)[0]].original;
  if (wikiImage) return wikiImage.source;
  return null;
};
