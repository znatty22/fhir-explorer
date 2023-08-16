import { NextRequest, NextResponse } from "next/server";
import { getOidcClient, getToken, getFhirData } from "@/lib/fhir";

type RequiredFhirParams = {
  fhirServerUrl?: string;
  fhirQuery?: string;
};

export async function POST(request: NextRequest) {
  // Validate request parameters
  let params: RequiredFhirParams = {};
  let error = null;
  try {
    params = await request.json();
  } catch (e) {
    error = "Badly formatted client data";
    return NextResponse.json(
      { error: "bad_client_data", details: error },
      { status: 400 }
    );
  }
  if (!(params?.fhirServerUrl && params?.fhirQuery)) {
    error =
      "Missing one or more required parameters `fhirServerUrl`, `fhirQuery`";
    return NextResponse.json(
      { error: "missing_required", details: error },
      { status: 400 }
    );
  }
  // Lookup OIDC client creds from server url
  const fhirServerUrl = new URL(params.fhirServerUrl);
  const oidcClient = getOidcClient(fhirServerUrl);
  if (!oidcClient) {
    error = `Unknown FHIR server url: ${params.fhirServerUrl}`;
    return NextResponse.json(
      { error: "unknown_fhir_server", details: error },
      { status: 400 }
    );
  }
  // Get token
  const tokenResp = await getToken(oidcClient);
  if (tokenResp.error) {
    return NextResponse.json(tokenResp, { status: tokenResp.status });
  }
  // Get FHIR Data
  let url = null;
  try {
    url = new URL(
      [
        String(params.fhirServerUrl).replace(/\/$/, ""),
        params.fhirQuery.replace(/^\/+/g, ""),
      ].join("/")
    );
  } catch (e) {
    return NextResponse.json(
      { error: "bad_fhir_query_url", details: `Invalid query: ${url}` },
      { status: 400 }
    );
  }

  const fhirResp = await getFhirData(url, tokenResp.access_token!);
  if (fhirResp.error) {
    return NextResponse.json(fhirResp, { status: fhirResp.status });
  }

  // Add smilecdr headers to response
  const headers = Object.fromEntries(fhirResp.headers!);
  return NextResponse.json(fhirResp.data, {
    headers: {
      "x-powered-by": headers["x-powered-by"],
      "x-request-id": headers["x-request-id"],
    },
  });
}
