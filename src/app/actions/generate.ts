"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "~/server/auth";
import { db } from "~/server/db";

export const generate = async () => {
  const serverSession = await getServerSession(authOptions);
  await db.user.update({
    where: {
      id: serverSession?.user.id,
    },
    data: {
      credits: {
        decrement: 1,
      },
    },
  });
};

export const refresh = async () => {
    revalidatePath("/dashboard");
}