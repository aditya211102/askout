import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cardId, plan, redirectUrl } = await req.json();

    if (!cardId || !plan) {
      return new Response(JSON.stringify({ error: "cardId and plan required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("DODO_PAYMENTS_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Payment not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Map plan to Dodo product ID — user will set these as secrets
    const productId =
      plan === "premium"
        ? Deno.env.get("DODO_PRODUCT_ID_PREMIUM")
        : Deno.env.get("DODO_PRODUCT_ID_BASIC");

    if (!productId) {
      return new Response(JSON.stringify({ error: "Product not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Determine base URL: use test mode unless DODO_LIVE_MODE is set
    const baseUrl = Deno.env.get("DODO_LIVE_MODE") === "true"
      ? "https://live.dodopayments.com"
      : "https://test.dodopayments.com";

    // Create Dodo Payments checkout session via Checkout Sessions API
    const response = await fetch(`${baseUrl}/checkouts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_cart: [{ product_id: productId, quantity: 1 }],
        success_url: redirectUrl || undefined,
        metadata: { card_id: cardId },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Dodo API error:", response.status, err);
      return new Response(JSON.stringify({ error: "Payment creation failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();

    return new Response(JSON.stringify({ payment_link: data.checkout_url || data.payment_link }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
