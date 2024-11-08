import { headers } from "next/headers";
import Stripe from "stripe";
import { env } from "~/env";
import { db } from "~/server/db";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("Stripe-Signature");
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) return;
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    return new Response(`Webhook Error`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const customerId = session.customer as string;

      const retrivedSession = await stripe.checkout.sessions.retrieve(
        session.id,
        { expand: ["line_items"] },
      );

      const lineItems = retrivedSession.line_items;
      if (lineItems && lineItems.data.length > 0) {
        const priceId = lineItems.data[0]?.price?.id ?? undefined;

        // Update user credits based on the priceId
        if (priceId) {
          let creditsToAdd = 0;

          // Determine credits to add
          switch (priceId) {
            case env.STRIPE_10_PACK:
              creditsToAdd = 10;
              break;
            case env.STRIPE_25_PACK:
              creditsToAdd = 25;
              break;
            case env.STRIPE_100_PACK:
              creditsToAdd = 100;
              break;
          }

          if (creditsToAdd > 0) {
            await db.user.update({
              where: { stripeCustomerId: customerId },
              data: { credits: { increment: creditsToAdd } },
            });
          }
        }
      }
      break;
    default:
      console.warn("Unhandled event type: " + event.type);
  }

  return new Response(JSON.stringify({ recieved: true }));
}
