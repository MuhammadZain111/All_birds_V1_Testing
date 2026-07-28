"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

//  #Here is the code for the AuthProvider component in the app/Context/AuthProvider.tsx file. It imports the SessionProvider from next-auth/react and wraps the children components with it, allowing them to access authentication session data. The component accepts children and an optional session prop, which can be used to provide session information if needed.

export default function AuthProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: any;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
