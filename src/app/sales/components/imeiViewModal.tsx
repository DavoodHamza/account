import React from "react";
import { Modal, Button } from "antd";
import { Table } from "react-bootstrap";

interface ImeiModalProps {
  open: boolean;
  onClose: () => void;
  imeiNumbers: string[];
}

const ImeiModal: React.FC<ImeiModalProps> = ({
  open,
  onClose,
  imeiNumbers,
}) => {
  return (
    <Modal
      title="IMEI Numbers"
      open={open}
      onCancel={onClose}
      centered
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      width={400} // Adjust modal width if necessary
      styles={{ body: { maxHeight: "400px", overflowY: "auto" } }}
    >
      <br />
      <Table responsive bordered>
        <tbody>
          {imeiNumbers?.map((item, index) =>
            item && item != null && item != "" ? (
              <tr key={index}>
                <td width={"50px"}>{index + 1}</td>
                <td>{item}</td>
              </tr>
            ) : null
          )}
        </tbody>
      </Table>
    </Modal>
  );
};

export default ImeiModal;
