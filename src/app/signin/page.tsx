"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Signin from "~/components/ui/signin";
import { authOptions } from "~/server/auth";

const Page = async () => {
  const serverSession = await getServerSession(authOptions);

  if (serverSession?.user) {
    redirect("/dashboard");
  }

  return (
    <>
      <Signin />
    </>
  );
};

export default Page;
