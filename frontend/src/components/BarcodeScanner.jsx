import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";
import API from "../api/axios";

function BarcodeScanner({ onScan }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      async (decodedText) => {
        try {
          const res = await API.get(`/products/barcode/${decodedText}`);
          onScan(res.data);
        } catch {
          alert("Product not found");
        }

        scanner.clear();
      },
      () => {}
    );

    return () => scanner.clear();
  }, []);

  return <div id="reader"></div>;
}

export default BarcodeScanner;