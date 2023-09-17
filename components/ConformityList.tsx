import { List, Spin } from "antd";
import { useEffect, useState } from "react";
import Link from "next/link";

interface ConformityListProps {
  type: string;
  zone: string;
}

interface DataType {
  code_commune: string;
  code_departement: string;
  conformity: string;
  name: string;
  code_postal: string;
}

export const ConformityList = ({ type, zone }: ConformityListProps) => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchConformityList = async () => {
      const response = await fetch("/api/landing", {
        method: "POST",
        body: JSON.stringify({
          type: "conformityList",
          zone: zone,
          conformityType: type,
        }),
      });
      const data = await response.json();
      setData(data);
      setLoading(false);
    };
    fetchConformityList();
  }, [type, zone]);

  return (
    <>
      <div className="text-center text-xs border-solid border-[#1890ff] rounded-lg border-2 mb-2">
        {data.length + " résultat(s)"}
      </div>
      <div className="overflow-auto h-64 border-solid border-2 rounded-lg border-slate-300">
        {loading ? (
          <Spin size="large" className="w-full" />
        ) : (
          <List
            size="small"
            dataSource={data}
            renderItem={(item) => (
              <List.Item key={item.name + item.code_postal}>
                <List.Item.Meta
                  title={
                    <Link href={`/commune/${item.code_commune}`}>
                      {item.name + " (" + item.code_postal + ")"}
                    </Link>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </>
  );
};
