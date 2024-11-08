"use server";

import { signInSchema } from "~/schemas/auth";
import { db } from "~/server/db";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { env } from "~/env";
import Stripe from "stripe";

export const signup = async (email: string, password: string) => {
  // Validation
  const isValid = signInSchema.safeParse({ email, password });

  if (isValid.error) {
    return "Error";
  }

  // See if user exists
  const user = await db.user.findUnique({
    where: {
      email: isValid.data.email,
    },
  });

  if (user) {
    return "User already exists";
  }

  // Encrypt password
  const hash = await bcrypt.hash(isValid.data.password, 10);

  // Create a stripe user
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);

  const stripeCustomer = await stripe.customers.create({
    email: isValid.data.email.toLowerCase(),
  });

  // Create the user
  await db.user.create({
    data: {
      email: isValid.data.email,
      password: hash,
      stripeCustomerId: stripeCustomer.id,
    },
  });

  // Redirect the user to signin, if is registered
  redirect("/signin");
};
