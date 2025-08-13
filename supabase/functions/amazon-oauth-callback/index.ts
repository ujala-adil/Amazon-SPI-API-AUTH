import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const url = new URL(req.url);
  const code = url.searchParams.get("spapi_oauth_code"); //authorization code
  const state = url.searchParams.get("state");
  const sellingPartnerId = url.searchParams.get("selling_partner_id");

  if (!code || !state || !sellingPartnerId) {
    return new Response("Missing parameters from Amazon", { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  //Validating the state
  const { data: stateRecord, error: stateError } = await supabase
    .from("oauth_states")
    .select("*")
    .eq("state", state)
    .single();

  if (stateError || !stateRecord) {
    console.log("Invalid or missing state:", state);
    return new Response("Invalid state", { status: 403 });
  }

  //Exchanging code for tokens
  const tokenRes = await fetch("https://api.amazon.com/auth/o2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: Deno.env.get("REDIRECT_URI")!,
      client_id: Deno.env.get("AMAZON_CLIENT_ID")!,
      client_secret: Deno.env.get("AMAZON_CLIENT_SECRET")!,
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    console.log("Token exchange failed:", tokenData);
    return new Response("Token exchange failed", { status: 401 });
  }

  //Storing token data in Supabase DB
  const { error: insertError } = await supabase.from("amazon_tokens").insert({
    selling_partner_id: sellingPartnerId,
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token,
    token_type: tokenData.token_type,
    expires_in: tokenData.expires_in,
    created_at: new Date().toISOString(),
  });

  if (insertError) {
    console.log("DB insert failed:", insertError);
    return new Response("Failed to save tokens", { status: 500 });
  }

  // Deleting used state from DB to prevent the use of the same state and save up space.
  // await supabase.from("oauth_states").delete().eq("state", state);

  // return new Response("Amazon OAuth successful. You may now close this tab."); 
  return Response.redirect("https://your-website.com/success", 302); //REPLACE WITH THE ACTUAL WEBSITE URL
});
