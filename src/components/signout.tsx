"use client";

import { signOut } from "next-auth/react";
import { PiSignOutLight } from "react-icons/pi";

const Signout = () => {
  return (
    <PiSignOutLight
      onClick={() => signOut()}
      className="h-6 w-6 cursor-pointer"
    />
  );
};

export default Signout;
