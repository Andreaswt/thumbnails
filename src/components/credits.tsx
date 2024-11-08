"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { db } from "~/server/db";

const Credits = async () => {
  const serverSession = await getServerSession(authOptions);
  console.log(serverSession?.user);
  const user = await db.user.findUnique({
    where: {
      id: serverSession?.user.id,
    },
    select: {
      credits: true,
    },
  });
  return <p>{user?.credits} credits left</p>;
};

export default Credits;
