"use client";

import { useEffect, useState } from "react";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";

interface CommuneNetworksProps {
  codeCommune: string;
}

interface WaterNetwork {
  key: string;
  networkName: string;
  networkCode: string;
  providerName: string;
  ugeName: string;
  moaName: string;
  lastTestDate: string;
}

export const CommuneNetworks = ({ codeCommune }: CommuneNetworksProps) => {
  const [networks, setNetworks] = useState<WaterNetwork[]>([]);
  const [loading, setLoading] = useState(true);

  // Get networks for this commune

  useEffect(() => {
    const fetchNetworks = async () => {
      const response = await fetch("/api/commune", {
        method: "POST",
        body: JSON.stringify({
          type: "networks",
          code: codeCommune,
        }),
      });
      const networks = await response.json();
      setNetworks(networks);
      setLoading(false);
    };
    fetchNetworks();
  }, [codeCommune]);

  const columns: ColumnsType<WaterNetwork> = [
    {
      title: "Réseau",
      dataIndex: "networkName",
      key: "networkName",
    },
    {
      title: "Code réseau",
      dataIndex: "networkCode",
      key: "networkCode",
    },
    {
      title: "Distributeur",
      dataIndex: "providerName",
      key: "providerName",
    },
    {
      title: "Unité de gestion de l'eau",
      dataIndex: "ugeName",
      key: "ugeName",
    },
    {
      title: "Maître d'ouvrage",
      dataIndex: "moaName",
      key: "moaName",
    },
    {
      title: "Date du dernier prélèvement",
      dataIndex: "lastTestDate",
      key: "lastTestDate",
    },
  ];

  return (
    <div className="sm:max-w-3xl sm:self-center p-1 border-solid border-slate-500 border-2 rounded-lg m-1">
      <Table
        columns={columns}
        loading={loading}
        dataSource={networks}
        scroll={{ x: true }}
        pagination={{ hideOnSinglePage: true, position: ["bottomCenter"] }}
      />
    </div>
  );
};
