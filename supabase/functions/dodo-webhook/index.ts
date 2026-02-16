import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, webhook-id, webhook-signature, webhook-timestamp",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    const webhookSecret = Deno.env.get("DODO_PAYMENTS_WEBHOOK_SECRET");

    if (!webhookSecret) {
      console.error("DODO_PAYMENTS_WEBHOOK_SECRET not set");
      return new Response(JSON.stringify({ error: "Webhook not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify signature using standardwebhooks
    const wh = new Webhook(webhookSecret);
    const headers = {
      "webhook-id": req.headers.get("webhook-id") || "",
      "webhook-signature": req.headers.get("webhook-signature") || "",
      "webhook-timestamp": req.headers.get("webhook-timestamp") || "",
    };

    let event: any;
    try {
      event = wh.verify(body, headers);
    } catch (err) {
      console.error("Invalid webhook signature:", err);
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Dodo webhook event:", event.event_type || event.type);

    const eventType = event.event_type || event.type || "";

    if (
      eventType === "payment.completed" ||
      eventType === "payment.succeeded" ||
      eventType === "payment_intent.succeeded" ||
      eventType === "order.completed"
    ) {
      const metadata = event.data?.metadata || event.metadata || {};
      const cardId = metadata.card_id;

      if (cardId) {
        const supabase = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        // Mark card as paid
        const { data: cardData, error } = await supabase
          .from("cards")
          .update({ paid: true })
          .eq("id", cardId)
          .select("user_id, plan")
          .single();

        if (error) {
          console.error("Failed to mark card as paid:", error);
          return new Response(JSON.stringify({ error: "DB update failed" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Update user's profile plan
        if (cardData?.user_id) {
          const { error: profileError } = await supabase
            .from("profiles")
            .update({ plan: cardData.plan })
            .eq("user_id", cardData.user_id);

          if (profileError) {
            console.error("Failed to update profile plan:", profileError);
          } else {
            console.log(`Profile for user ${cardData.user_id} updated to plan: ${cardData.plan}`);
          }
        }

        console.log(`Card ${cardId} marked as paid`);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
