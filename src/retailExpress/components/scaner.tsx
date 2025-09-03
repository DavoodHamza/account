import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { LiaBarcodeSolid } from "react-icons/lia"; 

const QRScannerModal = (props: any) => {
  const [visible, setVisible] = useState(false);

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const qrCodeSuccessCallback = (decodedText: string) => {
    props.qrCodeSuccessCallback(decodedText)
    setVisible(false);
  };

  const qrCodeErrorCallback = (errorMessage: string) => {
    console.error('Error scanning QR code:', errorMessage);
  };

  useEffect(() => {
    if (visible) {
      const html5QrcodeScanner = new Html5QrcodeScanner(
        "html5qr-code-full-region",
        {
          fps: 10,
          qrbox: 250,
          aspectRatio: 1,
          disableFlip: false,
        },
        true
      );
      html5QrcodeScanner.render(qrCodeSuccessCallback, qrCodeErrorCallback);
      return () => {
        html5QrcodeScanner.clear().catch((error:any) => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
      };
    }
  }, [visible]);

  return (
    <>
      <LiaBarcodeSolid size={20} onClick={() => setVisible(true)} />
      <Modal
        title="Scan QR Code"
        visible={visible}
        onOk={handleOk}
        footer={false}
        onCancel={handleCancel}
      >
        <div id="html5qr-code-full-region" style={{ width: '100%' }} />
      </Modal>
    </>
  );
};

export default QRScannerModal;
