"use client";

import { Card, Skeleton, Tabs } from "antd";
import { useEffect, useState } from "react";

interface CommuneParamsProps {
  codeCommune: string;
}

interface CardProps {
  title: string;
  value: number | null;
  unit: string | null;
  limit: string | null;
  reference: string | null;
  testType: string;
  paramCode: string;
  date: string;
  description: string;
}

export const CommuneParams = ({ codeCommune }: CommuneParamsProps) => {
  const [cards, setCards] = useState<CardProps[]>([]);

  // Get cards for this commune

  useEffect(() => {
    const fetchCards = async () => {
      const response = await fetch("/api/commune", {
        method: "POST",
        body: JSON.stringify({
          type: "cards",
          code: codeCommune,
        }),
      });
      const cards = await response.json();
      setCards(cards);
    };
    fetchCards();
  }, [codeCommune]);

  return (
    <div className="sm:max-w-lg sm:self-center p-1">
      <Skeleton loading={cards.length === 0} active />
      <Tabs
        type="line"
        items={cards.map((item) => ({
          label: item.title,
          key: item.title,
          children: (
            <Card
              key={item.title}
              className="border-solid border-slate-800 border-1 rounded-lg"
            >
              <p className="text-blue-800 text-justify border-solid border-blue-800 border-2 p-1 rounded-lg text-[0.65rem] mb-2">
                {item.description}
              </p>
              <p>
                {item.value} {item.unit}
              </p>
              <p>
                {item.limit ? "Limite de conformité : " + item.limit : null}
              </p>
              <p>
                {item.reference
                  ? "Référence de qualité : " + item.reference
                  : item.unit === "°f"
                  ? "Référence de qualité : <= 15 °f"
                  : null}
              </p>
              <p>
                {item.testType === "L"
                  ? "Testé en laboratoire"
                  : "Testé sur le terrain"}
              </p>
              <p>{"Date du dernier prélèvement : " + item.date}</p>
            </Card>
          ),
        }))}
      />
    </div>
  );
};
