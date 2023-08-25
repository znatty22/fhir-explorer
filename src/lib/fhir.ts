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

const OIDC_CLIENT_PRD = {
  clientId: process.env.FHIR_EXP_PRD_CLIENT_ID,
  clientSecret: process.env.FHIR_EXP_PRD_CLIENT_SECRET,
  tokenUrl: process.env.FHIR_EXP_PRD_OIDC_TOKEN_URL,
};
const OIDC_CLIENT_QA = {
  clientId: process.env.FHIR_EXP_QA_CLIENT_ID,
  clientSecret: process.env.FHIR_EXP_QA_CLIENT_SECRET,
  tokenUrl: process.env.FHIR_EXP_QA_OIDC_TOKEN_URL,
};
const OIDC_CLIENT_DEV = {
  clientId: process.env.FHIR_EXP_DEV_CLIENT_ID,
  clientSecret: process.env.FHIR_EXP_DEV_CLIENT_SECRET,
  tokenUrl: process.env.FHIR_EXP_DEV_OIDC_TOKEN_URL,
};
const OIDC_CLIENT_LOCAL = {
  clientId: process.env.FHIR_EXP_LOCAL_CLIENT_ID,
  clientSecret: process.env.FHIR_EXP_LOCAL_CLIENT_SECRET,
  tokenUrl: process.env.FHIR_EXP_LOCAL_OIDC_TOKEN_URL,
};

export const FHIR_SERVERS: FhirServerOptions = {
  localhost: {
    name: "Localhost FHIR Server",
    url: "http://localhost:8000",
    oidcClient: OIDC_CLIENT_LOCAL,
  },
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

export async function getTokenFromProxy(
  oidcClient: OidcClient
): Promise<TokenResponseData> {
  // If running local FHIR server, we cannot query issuer directly
  // Must go through the proxy
  const url = new URL(oidcClient.tokenUrl || "");
  const issuer = url.origin + url.pathname.split("/").slice(0, 3).join("/");

  const payload = {
    kwargs: {
      data: {
        grant_type: "client_credentials",
        client_id: oidcClient.clientId,
        client_secret: oidcClient.clientSecret,
      },
    },
    http_operation: "post",
    endpoint: `${issuer}/protocol/openid-connect/token`,
  };

  if (!process.env.KEYCLOAK_PROXY_URL) {
    return {
      error: "token_fetch_error",
      details:
        "Cannot get token for local FHIR server. You must have the keycloak proxy setup and the KEYCLOAK_PROXY_URL set in your .env.local",
      status: 400,
    };
  }

  let data = "";
  let err = false;
  try {
    const resp = await fetch(process.env.KEYCLOAK_PROXY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    err = !resp.ok;
    data = await resp.text();
  } catch (e) {
    err = true;
    console.error(e);
    console.error(data);
  }
  if (err) {
    return {
      error: "token_fetch_error",
      details: `Failed to fetch token from proxy ${process.env.KEYCLOAK_PROXY_URL}`,
      status: 400,
    };
  }
  return JSON.parse(data);
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
