import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// The following line is creating a browser-safe Supabase client using those credentials.
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const AMAZON_APP_ID = "YOUR_AMAZON_APP_ID"; //REPLACE WITH ACTUAL APPLICATION ID
const REDIRECT_URI = "https://<yourproject>.supabase.co"; //REPLACE WITH ACTUAL REDIRECT URI

function App() {
  const [loading, setLoading] = useState(false);

  const handleAmazonLogin = async () => {
    setLoading(true);

    //Generating a unique state
    const state = crypto.randomUUID();
    const userId = "crypto.randomUUID()"; //REPLACE WITH ACTUAL USER ID CODE

    //Saving the state + user ID to Supabase DB
    const { error } = await supabase.from("oauth_states").insert({ state, user_id: userId });

    if (error) {
      alert("Failed to initiate login. Please try again.");
      console.error("State insert error:", error);
      setLoading(false);
      return;
    }

    //Building the Amazon OAuth URL
    const authUrl = `https://sellercentral.amazon.com/apps/authorize/consent` +
      `?application_id=${AMAZON_APP_ID}` +
      `&state=${state}` +
      `&version=beta` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

    //Redirecting to Amazon
    window.location.href = authUrl;
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Connect Amazon Seller Account</h1>
      <button
        onClick={handleAmazonLogin}
        disabled={loading}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Redirecting..." : "Authorize with Amazon"}
      </button>
    </div>
  );
}

export default App;
