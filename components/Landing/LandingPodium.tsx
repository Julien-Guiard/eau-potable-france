"use client";

import ranking2022 from "@/utils/ranking2022.json";
import { List, Modal } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import { useState } from "react";
import WaveAnimation from "./WaveAnimation";
import PieChart from "../PieChart";

export const LandingPodium = () => {
  const data = ranking2022;
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };
  return (
    <>
      <div className="flex flex-col items-center justify-center m-2 mt-6">
        <div className="flex mb-6">
          <h1 className="mr-1 text-base sm:text-xl font-semibold">
            Podium 2022 des départements
          </h1>
          <InfoCircleOutlined
            style={{ color: "#1890ff", marginLeft: 5 }}
            onClick={showModal}
          />
          <Modal
            open={open}
            title="Comment est calculé le classement ?"
            onOk={() => setOpen(false)}
            onCancel={() => setOpen(false)}
            footer={[]}
          >
            <p>
              {
                "Le classement est calculé en établissant un ratio de conformité. Ce ratio est calculé en divisant le nombre de communes conformes par le nombre total de communes du département."
              }
            </p>
          </Modal>
        </div>
        <div className="max-w-md w-64 sm:w-80 border-solid border-2 rounded-lg border-slate-300 p-2 overflow-auto mb-5 h-96">
          <List
            itemLayout="vertical"
            dataSource={data}
            className="w-full"
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    index +
                    1 +
                    ". " +
                    item.departementName +
                    " (" +
                    item.departement +
                    ")" +
                    " - " +
                    item.region
                  }
                  description={item.conformityRate + "% de conformité"}
                  avatar={<PieChart ratio={parseFloat(item.conformityRate)} />}
                />
              </List.Item>
            )}
          />
        </div>
      </div>
    </>
  );
};
