"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { env } from "~/env";
import { authOptions } from "~/server/auth";
import { db } from "~/server/db";
import Stripe from "stripe";

export const redirectToBillingSession = async (priceId: string) => {
  if (
    ![env.STRIPE_10_PACK, env.STRIPE_25_PACK, env.STRIPE_100_PACK].includes(
      priceId,
    )
  ) {
    throw new Error("Invalid priceId");
  }

  const serverSession = await getServerSession(authOptions);

  const user = await db.user.findUnique({
    where: {
      id: serverSession?.user.id,
    },
    select: {
      stripeCustomerId: true,
    },
  });

  if (!user?.stripeCustomerId) {
    throw new Error("User has no stripeCustomerId");
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY);

  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: priceId, quantity: 1 }],
    customer: user.stripeCustomerId,
    mode: "payment",
    success_url: `${env.NEXTAUTH_URL}/api/session-callback`,
  });

  if (!session.url) throw new Error("No session URL");

  redirect(session.url);
};
