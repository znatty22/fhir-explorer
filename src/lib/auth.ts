import { NextAuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import { validateAppEnv } from "./env";

// Ensure app env vars exist
validateAppEnv();

export const authOptions: NextAuthOptions = {
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
      issuer: process.env.AUTH0_ISSUER!,
    }),
  ],
};
