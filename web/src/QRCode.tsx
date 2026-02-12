import { useEffect, useState } from "react";

function QRCode() {
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/url")
      .then((r) => r.json())
      .then((data) => setUrl(data.url))
      .catch(() => setUrl("(unavailable)"));
  }, []);

  return (
    <div className="qr-card">
      <h2 className="qr-title">Connect</h2>
      {!error ? (
        <img
          className="qr-image"
          src="/api/qr"
          alt="QR Code"
          onError={() => setError(true)}
        />
      ) : (
        <div className="qr-placeholder">
          <span>QR unavailable</span>
          <span className="qr-hint">Server may not be running</span>
        </div>
      )}
      <p className="qr-url">{url}</p>
    </div>
  );
}

export default QRCode;
