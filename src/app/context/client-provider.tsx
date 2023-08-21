"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { useSession, signIn } from "next-auth/react";

import LoginLoader from "@/components/Loader";

const AuthenticatedRoute = ({
  unauthenticatedRoute,
  children,
}: {
  unauthenticatedRoute: boolean;
  children: React.ReactNode;
}) => {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const isUser = !!session?.user;

  useEffect(() => {
    if (unauthenticatedRoute) {
      return;
    }
    if (loading) {
      return;
    }
    if (!isUser) {
      // If not authenticated, force log in
      void signIn("auth0", undefined, { prompt: "login" });
    }
  }, [unauthenticatedRoute, isUser, loading]);

  return unauthenticatedRoute || isUser ? <>{children}</> : <LoginLoader />;
};
export default function AppContextProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}): React.ReactNode {
  return (
    <SessionProvider session={session}>
      <AuthenticatedRoute unauthenticatedRoute={false}>
        {children}
      </AuthenticatedRoute>
    </SessionProvider>
  );
}
