"use client";

import { Divider } from "antd";
import { Modal } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import Title from "antd/es/typography/Title";

export const CommuneDividerParams = () => {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  return (
    <Divider>
      <div className="flex">
        <Title level={5} className="relative top-0.5">
          Métriques
        </Title>
        <InfoCircleOutlined
          style={{ color: "#1890ff", marginLeft: 5 }}
          onClick={showModal}
        />
      </div>
      <Modal
        open={open}
        title="Quelques données sur l'eau"
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        footer={[]}
      >
        <p>
          {`Cinq métriques importantes à la qualité de l'eau sont mises en avant plus bas : Le pH, la turbidité, la conductivité, les nitrates et la dureté de l'eau. Il est possible que certaines d'entres elles ne soient pas disponibles pour votre commune. En effet, tous les tests ne sont pas réalisés systématiquement pour chaque commune.`}
        </p>
      </Modal>
    </Divider>
  );
};
