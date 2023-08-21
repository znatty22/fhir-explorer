import { getAppEnv } from "./env";

export type OidcClient = {
  clientId: string | undefined;
  clientSecret: string | undefined;
  tokenUrl: string | undefined;
};

export type FhirServer = {
  name: string;
  url: string;
  oidcClient: OidcClient;
};

export type FhirServerOptions = {
  [key: string]: FhirServer;
};

export type FhirResponseData = {
  error?: string;
  details?: string;
  data?: any;
  headers?: [string, string][];
  status: number;
};
export type TokenResponseData = {
  error?: string;
  details?: string;
  status: number;
  access_token?: string;
  expires_in?: number;
  refresh_expires_in?: number;
  token_type?: string;
  "not-before-policy"?: string;
  scope?: string;
};

const appEnv: { [k: string]: string | undefined } = getAppEnv();

const OIDC_CLIENT_PRD = {
  clientId: appEnv.FHIR_EXP_PRD_CLIENT_ID,
  clientSecret: appEnv.FHIR_EXP_PRD_CLIENT_SECRET,
  tokenUrl: appEnv.FHIR_EXP_PRD_OIDC_TOKEN_URL,
};
const OIDC_CLIENT_QA = {
  clientId: appEnv.FHIR_EXP_QA_CLIENT_ID,
  clientSecret: appEnv.FHIR_EXP_QA_CLIENT_SECRET,
  tokenUrl: appEnv.FHIR_EXP_QA_OIDC_TOKEN_URL,
};
const OIDC_CLIENT_DEV = {
  clientId: appEnv.FHIR_EXP_DEV_CLIENT_ID,
  clientSecret: appEnv.FHIR_EXP_DEV_CLIENT_SECRET,
  tokenUrl: appEnv.FHIR_EXP_DEV_OIDC_TOKEN_URL,
};

export const FHIR_SERVERS: FhirServerOptions = {
  kf_dev: {
    name: "Kids First DEV FHIR Server",
    url: "https://kf-api-fhir-service-upgrade-dev.kf-strides.org",
    oidcClient: OIDC_CLIENT_DEV,
  },
  kf_qa: {
    name: "Kids First QA FHIR Server",
    url: "https://kf-api-fhir-service-upgrade-qa.kf-strides.org",
    oidcClient: OIDC_CLIENT_QA,
  },
  kf_prd: {
    name: "Kids First PRD FHIR Server",
    url: "https://kf-api-fhir-service-upgrade.kf-strides.org",
    oidcClient: OIDC_CLIENT_PRD,
  },
  include_dev: {
    name: "INCLUDE DCC DEV FHIR Server",
    url: "https://include-api-fhir-service-upgrade-dev.includedcc.org",
    oidcClient: OIDC_CLIENT_DEV,
  },
  include_qa: {
    name: "INCLUDE DCC QA FHIR Server",
    url: "https://include-api-fhir-service-upgrade-qa.includedcc.org",
    oidcClient: OIDC_CLIENT_QA,
  },
  include_prd: {
    name: "INCLUDE DCC PRD FHIR Server",
    url: "https://include-api-fhir-service-upgrade.includedcc.org",
    oidcClient: OIDC_CLIENT_PRD,
  },
};

const FHIR_SERVER_OIDC_MAP: {
  [key: string]: OidcClient;
} = Object.fromEntries(
  Object.keys(FHIR_SERVERS).map((key) => {
    return [FHIR_SERVERS[key].url, FHIR_SERVERS[key].oidcClient];
  })
);

export function getOidcClient(fhirServerUrl: URL): OidcClient {
  const url = String(fhirServerUrl).replace(/\/$/, "").trim();
  return FHIR_SERVER_OIDC_MAP[url];
}
export async function getToken(
  oidcClient: OidcClient
): Promise<TokenResponseData> {
  // Exchange OIDC client credentials for bearer token
  const formData = new URLSearchParams();
  formData.append("grant_type", "client_credentials");
  formData.append("client_id", oidcClient.clientId!);
  formData.append("client_secret", oidcClient.clientSecret!);

  let resp = null;
  try {
    resp = await fetch(oidcClient.tokenUrl!, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });
  } catch (e: any) {
    if (String(e.cause).includes("ENOTFOUND")) {
      return {
        error: "could_not_connect",
        details: `Could not connect to OIDC server: ${oidcClient.tokenUrl}`,
        status: 500,
      };
    } else if (String(e.cause).includes("ERR_INVALID_URL")) {
      return {
        error: "no_oidc_client",
        details: `Could not find OIDC client`,
        status: 500,
      };
    }
    throw e;
  }
  const data = await resp.json();

  if (resp.ok && !!data.access_token) {
    return { ...data, status: resp.status };
  } else {
    return {
      error: "token_fetch_error",
      details: data.error_description,
      status: resp.status,
    };
  }
}
export async function getFhirData(
  url: URL,
  oidcToken: string
): Promise<FhirResponseData> {
  let resp = null;
  try {
    resp = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${oidcToken}`,
      },
    });
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
  let data = await resp.text();

  try {
    data = JSON.parse(data);
  } catch (e) {
    return {
      error: "badly_formatted_fhir_data",
      details: data,
      status: resp.status,
    };
  }

  if (resp.status === 404) {
    return {
      error: "unknown_fhir_resource_type",
      details: data,
      status: resp.status,
    };
  }

  return { data, headers: [...resp.headers], status: resp.status };
}
