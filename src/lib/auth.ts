import { NextAuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import { getAppEnv } from "./env";

const appEnv = getAppEnv();

export const authOptions: NextAuthOptions = {
  providers: [
    Auth0Provider({
      clientId: appEnv.AUTH0_CLIENT_ID!,
      clientSecret: appEnv.AUTH0_CLIENT_SECRET!,
      issuer: appEnv.AUTH0_ISSUER!,
    }),
  ],
};
