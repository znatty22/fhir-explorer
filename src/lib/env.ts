import { invariantEnv } from "./utils";

const BASE_ENV = [
  "NEXTAUTH_SECRET",
  "AUTH0_CLIENT_ID",
  "AUTH0_CLIENT_SECRET",
  "AUTH0_ISSUER",
];

const EXT_SERVICES_ENV = [
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

const LOCALHOST_ENV = [
  "FHIR_EXP_LOCAL_CLIENT_ID",
  "FHIR_EXP_LOCAL_CLIENT_SECRET",
  "FHIR_EXP_LOCAL_OIDC_TOKEN_URL",
];

export function isDevelopment() {
  return process.env.NODE_ENV === "development";
}

export function isProduction() {
  return process.env.NODE_ENV === "production";
}

export function validateAppEnv() {
  let envVars: string[] = [...BASE_ENV];

  if (isProduction()) {
    envVars = [...envVars, ...LOCALHOST_ENV, "NEXTAUTH_URL"];
  } else {
    envVars = [...envVars, ...EXT_SERVICES_ENV];
  }
  // Check that all env vars are set or throw Error
  envVars.map((v) => invariantEnv(process.env[v], v));

  // Return object of all app env vars
  return Object.fromEntries(envVars.map((v) => [v, process.env[v]]));
}

export function shouldInitializeSentry() {
  return !isDevelopment() || process.env.NEXT_PUBLIC_ENABLE_SENTRY_DEV === "1";
}
