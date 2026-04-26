import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useRef } from "react";
import API from "../api/axios";

function BarcodeScanner({ onScan }) {
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scannerRef.current = scanner;

    scanner.render(
      async (decodedText) => {
        try {
          const res = await API.get(`/products/barcode/${decodedText}`);
          onScan(res.data);
        } catch {
          alert("Product not found");
        }

        scanner.clear().catch(() => {});
      },
      (error) => {}
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, []);

  return <div id="reader"></div>;
}

export default BarcodeScanner;