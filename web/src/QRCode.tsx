import { useEffect, useState } from "react";

function QRCode() {
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState(false);

  useEffect(() => {
    // Fetch connection URL from an endpoint, or derive from the QR image.
    // For now, show the server address.
    setUrl(`${window.location.protocol}//${window.location.host}`);
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
