"use client";

import { Divider } from "antd";
import { Modal } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import Title from "antd/es/typography/Title";

export const CommuneDividerNetworks = () => {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  return (
    <Divider>
      <div className="flex">
        <Title level={5} className="relative top-0.5">
          Réseaux
        </Title>
        <InfoCircleOutlined
          style={{ color: "#1890ff", marginLeft: 5 }}
          onClick={showModal}
        />
      </div>
      <Modal
        open={open}
        title="Quelques informations sur les réseaux"
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        footer={[]}
      >
        <p>
          {`Une commune peut avoir plusieurs réseaux de distribution d'eau potable. Chaque réseau a un code réseau, un distributeur, une unité de gestion de l'eau ainsi qu'un maître d'ouvrage. Ces informations sont disponibles dans le tableau ci-dessous.`}
        </p>
      </Modal>
    </Divider>
  );
};
