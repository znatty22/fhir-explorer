import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { TokenResponseData, getOidcClient } from "@/lib/fhir";
import { getTokenFromProxy, getToken } from "@/lib/fhir";

type RequiredStatusParams = {
  fhirServerUrl: string;
};

const schema = {
  fhirServerUrl: {
    type: "string",
    example: "http://myfhirserver.com",
  },
};

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  // User must be logged in to use this API route
  if (!session) {
    return NextResponse.json(
      { error: "unauthorized", details: "Access Denied", status: 401 },
      { status: 401 }
    );
  }

  // Validate request parameters
  let params: RequiredStatusParams | null;
  let error = null;
  try {
    params = await request.json();
  } catch (e) {
    error = `Invalid client data. Required params are: ${JSON.stringify(
      schema
    )}`;
    return NextResponse.json(
      { error: "bad_client_data", details: error },
      { status: 400 }
    );
  }
  if (!params?.fhirServerUrl) {
    error = "Missing one or more required parameters `fhirServerUrl`";
    return NextResponse.json(
      { error: "missing_required", details: error },
      { status: 400 }
    );
  }
  // Lookup OIDC client creds from server url
  const fhirServerUrl = new URL(params.fhirServerUrl);
  const oidcClient = getOidcClient(fhirServerUrl);

  // No OIDC configured for server
  if (Object.values(oidcClient).every((v) => !v)) {
    error = `No OIDC client configured for FHIR server: ${params.fhirServerUrl}. Ensure env variables are set`;
    return NextResponse.json(
      { error: "fhir_server_missing_oidc_config", details: error },
      { status: 400 }
    );
  }
  // Server does not exist in list of configured servers
  if (!oidcClient) {
    error = `Unknown FHIR server url: ${params.fhirServerUrl}`;
    return NextResponse.json(
      { error: "unknown_fhir_server", details: error },
      { status: 400 }
    );
  }
  // Get access token
  // If fetching the access token for the local FHIR server then we must
  // fetch it from the issuer proxy since we cannot query the issuer directly
  // See https://github.com/kids-first/kf-api-fhir-service#-important-note-about-keycloak
  let tokenResp: TokenResponseData;
  if (String(fhirServerUrl).startsWith("http://localhost")) {
    tokenResp = await getTokenFromProxy(oidcClient);
  } else {
    tokenResp = await getToken(oidcClient);
  }
  if (tokenResp.error) {
    return NextResponse.json(tokenResp, { status: tokenResp.status });
  }
  // Get FHIR Data
  let url = null;
  try {
    url = new URL("/endpoint-health", fhirServerUrl);
  } catch (e) {
    return NextResponse.json(
      { error: "bad_fhir_server_url", details: `Invalid url: ${url}` },
      { status: 400 }
    );
  }

  let data;
  try {
    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenResp.access_token}`,
      },
    });
    data = await resp.json();
  } catch (e: any) {
    if (String(e.cause).includes("ENOTFOUND")) {
      return {
        error: "could_not_connect",
        details: `Could not connect to FHIR server: ${url}`,
        status: 500,
      };
    }
    throw e;
  }
  return NextResponse.json(data);
}
