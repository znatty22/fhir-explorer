import { invariantEnv } from "./utils";

const envVars = [
  "AUTH0_CLIENT_ID",
  "AUTH0_CLIENT_SECRET",
  "AUTH0_ISSUER",
  "FHIR_EXP_PRD_CLIENT_ID",
  "FHIR_EXP_PRD_CLIENT_SECRET",
  "FHIR_EXP_PRD_OIDC_TOKEN_URL",
  "FHIR_EXP_QA_CLIENT_ID",
  "FHIR_EXP_QA_CLIENT_SECRET",
  "FHIR_EXP_QA_OIDC_TOKEN_URL",
  "FHIR_EXP_DEV_CLIENT_ID",
  "FHIR_EXP_DEV_CLIENT_SECRET",
  "FHIR_EXP_DEV_OIDC_TOKEN_URL",
];

if (process.env.NODE_ENV !== "production") {
  envVars.push("NEXTAUTH_URL");
}

export function getAppEnv() {
  // Check that all env vars are set or throw Error
  envVars.map((v) => invariantEnv(process.env[v], v));

  // Return object of all app env vars
  return Object.fromEntries(envVars.map((v) => [v, process.env[v]]));
}
