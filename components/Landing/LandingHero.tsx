"use client";

import useDebounce from "@/hooks/useDebounce";
import { Alert, AutoComplete, Modal, Spin, Tooltip } from "antd";
import { useEffect, useState } from "react";
import {
  CloseSquareFilled,
  GlobalOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import WaveAnimation from "./WaveAnimation";

export const LandingHero = () => {
  const [communes, setCommunes] = useState<{ label: string; value: string }[]>(
    [],
  );
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [fetching, setFetching] = useState(false);
  const [geolocationError, setGeolocationError] = useState(false);
  const debouncedSearch = useDebounce(search, 300);
  const router = useRouter();

  useEffect(() => {
    setFetching(true);
    if (debouncedSearch.length === 0) {
      setCommunes([]);
      setFetching(false);
      return;
    }
    const fetchCommuneNames = async () => {
      const response = await fetch("/api/landing", {
        method: "POST",
        body: JSON.stringify({
          type: "communeSearch",
          search: debouncedSearch,
        }),
      });
      const data = await response.json();
      setCommunes(
        data.map((commune: any) => ({
          label: commune.name,
          value: commune.codeCommune,
          key: commune.key,
        })),
      );
      setFetching(false);
    };
    fetchCommuneNames();
  }, [debouncedSearch]);

  const onChange = (value: string) => {
    setFetching(true);
    setSearch(value);
  };

  const onSelect = (value: string) => {
    setSearch("");
    router.push(`/commune/${value}`);
  };

  const geolocate = () => {
    navigator.geolocation.getCurrentPosition(
      async (position: GeolocationPosition) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const response = await fetch("/api/landing", {
          method: "POST",
          body: JSON.stringify({
            type: "geolocate",
            position: { lat, lon },
          }),
        });
        const codeCommune = await response.json();
        if (!codeCommune) {
          setGeolocationError(true);
          return;
        }
        setSearch("");
        router.push(`/commune/${codeCommune}`);
      },
    );
  };

  const showModal = () => {
    setOpen(true);
  };

  return (
    <>
      <nav className="sticky top-0 z-10 bg-blue-400 shadow-xl backdrop-filter backdrop-blur-lg border-b border-gray-200 bg-opacity-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-center h-20">
            <h1 className="text-2xl font-bold sm:text-3xl">
              {"Eau potable France"}
            </h1>
          </div>
        </div>
        <WaveAnimation className="fixed z-20 top-0 h-20 w-full" />
      </nav>
      <div className="flex flex-col items-center justify-center mt-10">
        <div className="flex">
          <h1 className="mr-1 text-base sm:text-xl font-semibold">
            {"Qualité de l'eau potable en France"}
          </h1>
          <InfoCircleOutlined
            style={{ color: "#1890ff", marginLeft: 5 }}
            onClick={showModal}
          />
        </div>
        <Modal
          open={open}
          title="Comment est calculée la conformité ?"
          onOk={() => setOpen(false)}
          onCancel={() => setOpen(false)}
          footer={[]}
        >
          <p>
            {`Pour chaque évaluation de la qualité de l'eau en 2022, une note de conformité est attribuée en fonction des normes chimiques et bactériologiques établies.`}
            <br />
            {`Une commune est qualifiée de "conforme" si tous ses tests effectués au cours de l'année confirment que son eau respecte ces normes de qualité.`}
            <br />
            {`En revanche, si un seul de ces tests révèle une non-conformité, la commune est alors considérée comme "non conforme".`}
          </p>
        </Modal>
        <div className="mt-4 w-56 sm:w-64 md:w-72 flex">
          <AutoComplete
            className="w-full"
            options={communes.map((commune) => ({
              value: commune.value,
              label: commune.label,
            }))}
            size="large"
            value={search}
            placeholder="Rechercher par commune"
            onChange={onChange}
            onSelect={onSelect}
            notFoundContent={
              fetching ? <Spin size="default" className="w-full" /> : null
            }
            allowClear={{ clearIcon: <CloseSquareFilled /> }}
          />
          <Tooltip
            arrow={false}
            overlayInnerStyle={{ fontSize: "0.8rem", lineHeight: "1rem" }}
            placement="right"
            title="Géolocalisation !"
          >
            <GlobalOutlined className="ml-2 opacity-70" onClick={geolocate} />
          </Tooltip>
        </div>
        {geolocationError && (
          <Alert
            className="fixed top-5 mx-2 z-10"
            message={`Malheureusement, il y a eu un soucis lors de la récupération de
        votre code commune par géolocalisation.`}
            type="error"
            showIcon
            closable
            onClose={() => setGeolocationError(false)}
          />
        )}
      </div>
    </>
  );
};
