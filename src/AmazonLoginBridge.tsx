import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AmazonLoginBridge() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const amazonCallbackUri = params.get("amazon_callback_uri");
    const amazonState = params.get("amazon_state");
    const sellingPartnerId = params.get("selling_partner_id");

    if (!amazonCallbackUri || !amazonState || !sellingPartnerId) {
      console.error("Missing parameters from Amazon");
      alert("Missing required information from Amazon.");
      return;
    }

    // Optional: store sellingPartnerId in session or backend if needed

    // Redirect back to Amazon's confirmation URI with restored state
    const redirectTo = `${amazonCallbackUri}&state=${encodeURIComponent(amazonState)}`;
    window.location.href = redirectTo;
  }, [navigate]);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>Redirecting back to Amazon...</h2>
    </div>
  );
}

export default AmazonLoginBridge;
