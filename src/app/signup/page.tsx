"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Signup from "~/components/ui/signup";
import { authOptions } from "~/server/auth";

const Page = async () => {
  const serverSession = await getServerSession(authOptions);

  if (serverSession?.user) {
    redirect("/dashboard");
  }

  return (
    <>
      <Signup />
    </>
  );
};

export default Page;
