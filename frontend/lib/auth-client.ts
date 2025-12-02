import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins"
import { stripeClient } from "@better-auth/stripe/client"
import { adminClient } from "better-auth/client/plugins"
import { env } from "./config";

export const authClient = createAuthClient({
  plugins: [
    organizationClient(), 
    stripeClient({
      subscription: true,
    }),
    adminClient()
  ],
  baseURL: env.API_URL.toString() + "/auth",
  fetchOptions: {
    credentials: "include",
  }
});

export const { 
  signIn, 
  signUp, 
  signOut, 
  useSession,
  sendVerificationEmail,
  organization,
  useActiveOrganization,
  subscription,
  admin,
} = authClient;
