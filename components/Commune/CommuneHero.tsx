"use client";

import { Skeleton, Tag, Tooltip, Typography } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CheckCircleOutlined,
  HomeFilled,
  ExclamationCircleOutlined,
  LinkOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

interface WaterTestProps {
  description: string;
  bactLimit: string;
  pcLimit: string;
  bactRef: string;
  pcRef: string;
  date: string;
}

interface Commune {
  name: string;
  departement: string;
  region: string;
}

export const CommuneHero = ({ codeCommune }: { codeCommune: string }) => {
  const [commune, setCommune] = useState<Commune>({
    name: "",
    departement: "",
    region: "",
  });
  const [waterTest, setWaterTest] = useState<WaterTestProps>({
    description: "",
    bactLimit: "",
    pcLimit: "",
    bactRef: "",
    pcRef: "",
    date: "",
  });
  const [cityImage, setCityImage] = useState<string>("");
  const [loadingCommune, setLoadingCommune] = useState<boolean>(true);
  const [loadingImage, setLoadingImage] = useState<boolean>(true);
  const [imageNotFound, setImageNotFound] = useState<boolean>(false);
  const [loadingWaterTest, setLoadingWaterTest] = useState<boolean>(true);

  // Fetch commune name departement and region from code

  useEffect(() => {
    const fetchCommune = async () => {
      const reponse = await fetch("/api/commune", {
        method: "POST",
        body: JSON.stringify({
          type: "commune",
          code: codeCommune,
        }),
      });
      const commune: Commune = await reponse.json();
      setCommune(commune);
      setLoadingCommune(false);
    };
    fetchCommune();
  }, [codeCommune]);

  // Fetch city image from name

  useEffect(() => {
    if (!commune.name) return;
    const fetchCityImage = async () => {
      const reponse = await fetch("/api/commune", {
        method: "POST",
        body: JSON.stringify({
          type: "cityImage",
          name: commune.name,
          departement: commune.departement,
        }),
      });

      const image = await reponse.json();
      setCityImage(image);
      if (image === null) setImageNotFound(true);
    };
    fetchCityImage();
  }, [commune]);

  // Get latest water test for this commune

  useEffect(() => {
    const fetchWaterTest = async () => {
      const reponse = await fetch("/api/commune", {
        method: "POST",
        body: JSON.stringify({
          type: "waterTest",
          code: codeCommune,
        }),
      });
      const waterTest = await reponse.json();
      const { description, bactLimit, pcLimit, bactRef, pcRef, date } =
        waterTest;
      setWaterTest({ description, bactLimit, pcLimit, bactRef, pcRef, date });
      setLoadingWaterTest(false);
    };
    fetchWaterTest();
  }, [codeCommune]);

  return (
    <>
      <nav className="sticky top-0 z-10 bg-blue-400 shadow-xl backdrop-filter backdrop-blur-lg border-b border-gray-200 bg-opacity-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-3 items-center text-center h-20">
            <Link href="/" className="text-2xl text-gray-900 font-semibold">
              <HomeFilled className="hover:opacity-80" />
            </Link>
            <div className="flex items-center justify-center">
              {loadingCommune && <Skeleton.Input active={true} size="small" />}
              {!loadingCommune && (
                <>
                  <h1 className="text-sm sm:text-xl md:text-2xl">
                    {commune.name}
                  </h1>
                  <Tooltip placement="bottom" title={"Trouve moi sur maps !"}>
                    <Link
                      href={`https://www.google.com/maps/search/${commune.name}+${commune.departement}+${commune.region}`}
                      target="_blank"
                      className="relative top-0.5 sm:top-1 ml-1 text-[0.7rem] sm:text-sm"
                    >
                      <LinkOutlined className="hover:opacity-80 " />
                    </Link>
                  </Tooltip>
                </>
              )}
            </div>
            <div className="flex flex-col text-gray-900 text-[0.65rem]">
              {loadingCommune && (
                <Skeleton.Input active={true} size="small" className="mb-1" />
              )}
              {loadingCommune && <Skeleton.Input active={true} size="small" />}
              {!loadingCommune && <h2>{commune.region}</h2>}
              {!loadingCommune && <h3>{commune.departement}</h3>}
            </div>
          </div>
        </div>
      </nav>
      <div className="flex flex-col items-center m-2">
        {loadingImage && loadingWaterTest && (
          <Skeleton.Image
            active
            style={{ width: 300, height: 300 }}
          ></Skeleton.Image>
        )}
        {cityImage && (
          <div>
            <Image
              src={cityImage}
              alt={commune.name}
              width={300}
              height={300}
              priority={true}
              onLoadingComplete={() => setLoadingImage(false)}
              className="w-auto rounded-lg border-slate-800 border-2 overflow-hidden"
            />
          </div>
        )}
        {imageNotFound && (
          <div className="text-md">
            <p>Aucune image trouvée pour cette commune </p>
          </div>
        )}
        <Skeleton
          active
          loading={loadingWaterTest && loadingImage}
          style={{ width: 300, height: 300, marginTop: 10 }}
        />
        {!loadingWaterTest && (
          <div className="items-center border-4 rounded-lg mt-2 text-left p-2 max-w-md">
            <Title level={3} className="text-center">
              {"Qualité de l'eau"}
            </Title>
            <section className="mb-2">
              <Title level={5} className="text-center">
                Conclusion du dernier prélèvement
              </Title>
              <p className="text-center text-[0.70rem] mb-2">
                le {waterTest.date}
              </p>
              <p className="text-blue-800 border-solid border-blue-800 border-2 p-1 rounded-lg text-[0.65rem]">
                {waterTest.description}
              </p>
            </section>
            <div className="grid grid-cols-2 grid-rows-2">
              <section className="grid grid-rows-2 border-b-2 border-r-2 rounded-md p-1 items-center justify-center text-center">
                <Text strong={true}>
                  Conformité <br /> bactériologique
                </Text>
                {waterTest.bactLimit === "C" ? (
                  <Tag icon={<CheckCircleOutlined />} color="success">
                    Conforme
                  </Tag>
                ) : (
                  <Tag icon={<ExclamationCircleOutlined />} color="error">
                    Non conforme
                  </Tag>
                )}
              </section>
              <section className="grid grid-rows-2 border-l-2 border-b-2 rounded-md p-1 items-center justify-center text-center">
                <Text strong={true}>
                  Conformité <br /> chimique
                </Text>
                {waterTest.pcLimit === "C" ? (
                  <Tag icon={<CheckCircleOutlined />} color="success">
                    Conforme
                  </Tag>
                ) : (
                  <Tag icon={<ExclamationCircleOutlined />} color="error">
                    Non conforme
                  </Tag>
                )}
              </section>
              <section className="grid grid-rows-2 border-r-2 border-t-2 rounded-md p-1 items-center justify-center text-center">
                <Text strong={true}>
                  Référence <br /> bactériologique
                </Text>
                {waterTest.bactRef === "C" ? (
                  <Tag icon={<CheckCircleOutlined />} color="success">
                    Conforme
                  </Tag>
                ) : (
                  <Tag icon={<ExclamationCircleOutlined />} color="error">
                    Non conforme
                  </Tag>
                )}
              </section>
              <section className="grid grid-rows-2 border-l-2 border-t-2 rounded-md p-1 items-center justify-center text-center">
                <Text strong={true}>
                  Référence <br /> chimique
                </Text>
                {waterTest.pcRef === "C" ? (
                  <Tag icon={<CheckCircleOutlined />} color="success">
                    Conforme
                  </Tag>
                ) : (
                  <Tag icon={<ExclamationCircleOutlined />} color="error">
                    Non conforme
                  </Tag>
                )}
              </section>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
