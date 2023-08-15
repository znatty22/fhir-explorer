export type OidcClient = {
  clientId: string | undefined;
  clientSecret: string | undefined;
  tokenUrl: string | undefined;
};

const OIDC_CLIENT_PRD = {
  clientId: process.env.FHIR_EXP_KF_PRD_CLIENT_ID,
  clientSecret: process.env.FHIR_EXP_KF_PRD_CLIENT_SECRET,
  tokenUrl: process.env.FHIR_EXP_OIDC_TOKEN_URL_PRD,
};
const OIDC_CLIENT_QA = {
  clientId: process.env.FHIR_EXP_KF_QA_CLIENT_ID,
  clientSecret: process.env.FHIR_EXP_KF_QA_CLIENT_SECRET,
  tokenUrl: process.env.FHIR_EXP_OIDC_TOKEN_URL_QA,
};
const OIDC_CLIENT_DEV = {
  clientId: process.env.FHIR_EXP_KF_DEV_CLIENT_ID,
  clientSecret: process.env.FHIR_EXP_KF_DEV_CLIENT_SECRET,
  tokenUrl: process.env.FHIR_EXP_OIDC_TOKEN_URL_QA,
};

const FHIR_SERVER_OIDC_MAP: {
  [key: string]: OidcClient;
} = {
  "https://kf-api-fhir-service-upgrade.kf-strides.org": OIDC_CLIENT_PRD,
  "https://kf-api-fhir-service-upgrade-qa.kf-strides.org": OIDC_CLIENT_QA,
  "https://kf-api-fhir-service-upgrade-dev.kf-strides.org": OIDC_CLIENT_DEV,
  "https://include-api-fhir-service-upgrade.includedcc.org": OIDC_CLIENT_PRD,
  "https://include-api-fhir-service-upgrade-qa.includedcc.org": OIDC_CLIENT_QA,
  "https://include-api-fhir-service-upgrade-dev.includedcc.org":
    OIDC_CLIENT_DEV,
};

export function getOidcClient(fhirServerUrl: URL) {
  const url = String(fhirServerUrl).replace(/\/$/, "").trim();
  return FHIR_SERVER_OIDC_MAP[url];
}
export async function getToken(oidcClient: OidcClient) {
  // Exchange OIDC client credentials for bearer token
  const formData = new URLSearchParams();
  formData.append("grant_type", "client_credentials");
  formData.append("client_id", oidcClient.clientId!);
  formData.append("client_secret", oidcClient.clientSecret!);

  const resp = await fetch(oidcClient.tokenUrl!, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

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
export async function getFhirData(url: URL, oidcToken: string) {
  const resp = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${oidcToken}`,
    },
  });
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

  return { data, status: resp.status };
}
