"use client";

import { Tabs, Select, Tooltip } from "antd";
import { ConformityList } from "../ConformityList";
import departements from "@/utils/departements-region.json";
import { useState } from "react";
import { CloseSquareFilled } from "@ant-design/icons";

export const LandingDepartement = () => {
  const [zone, setZone] = useState("0");

  const departementTabs = [
    {
      label: "Conformes",
      key: "1",
      children: <ConformityList type={"C"} zone={zone} />,
    },
    {
      label: "Non conformes",
      key: "2",
      children: <ConformityList type={"N"} zone={zone} />,
    },
  ];

  const departementFilterOption = (input: string, option: any) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const onSelectDepartement = (value: string) => {
    setZone(value);
  };

  return (
    <div className="flex flex-col flex-auto items-center justify-center p-3">
      <div className="w-56 sm:w-64 md:w-72 flex">
        <Select
          showSearch
          size="large"
          className="overflow-hidden w-full"
          placeholder="Rechercher par département"
          optionFilterProp="children"
          filterOption={departementFilterOption}
          options={departements.map((departement) => ({
            value: departement.num_dep,
            label:
              `${departement.dep_name} ` + ` (${departement.num_dep}` + ")",
          }))}
          onSelect={onSelectDepartement}
        />
        <Tooltip
          arrow={false}
          overlayInnerStyle={{ fontSize: "0.8rem", lineHeight: "1rem" }}
          placement="right"
          title="Effacer les onglets"
        >
          <CloseSquareFilled className="ml-2" onClick={() => setZone("0")} />
        </Tooltip>
      </div>

      {zone !== "0" ? (
        <Tabs defaultActiveKey="1" size={"large"} items={departementTabs} />
      ) : (
        <div className="flex-auto"></div>
      )}
    </div>
  );
};
