import { CredentialContext, CredentialsContext } from "./credentialContext";
import { useContext } from "react";
import { CookieAuthResult, StoredRiotCookie } from "./entities";

const RIOT_COOKIE = "RIOT_COOKIE";
type CookieId = "asid" | "ssid";

function getTokensFromUri(uri: string) {
  const url = new URL(uri);
  const params = new URLSearchParams(url.hash.substring(1));
  const access_token = params.get("access_token");
  const id_token = params.get("id_token");
  const expires_in = parseInt(params.get("expires_in") || "0");

  return { access_token, id_token, expires_in };
}

function extractCookieById(cookie: string, id: CookieId) {
  return cookie.split(", ").find((v: string) => RegExp(`^${id}`).test(v));
}

export async function getNewCookie(ctx: CredentialContext): Promise<string> {
  for (let i = 0; i < 3; i++) {
    const [tokenRes, { cookie }] = await fetchWithCookie(
      ctx,
      "/api/cookie",
      "asid",
      { method: "POST" }
    );
    if (!cookie) continue;
    const asidCookie = extractCookieById(cookie, "asid");
    if (!asidCookie || !asidCookie.length) continue;
    return asidCookie;
  }
  throw Error("Unable to initialize cookies");
}

export async function fetchWithCookie(
  { credentials, setCredentials }: CredentialContext,
  url: URL | RequestInfo,
  cookieIdToStore: CookieId,
  init?: RequestInit
): Promise<[response: Response, body: any]> {
  let config = structuredClone(init);

  if (credentials.cookie.length) {
    if (!config)
      config = { body: JSON.stringify({ cookie: credentials.cookie }) };
    else if (!config.body)
      config.body = JSON.stringify({ cookie: credentials.cookie });
    else
      config.body = JSON.stringify({
        cookie: credentials.cookie,
        ...JSON.parse(config.body.toString()),
      });
  }

  const response = await fetch(url, config);
  const body = await response.json();

  const newCookie = extractCookieById(body.cookie, cookieIdToStore);
  if (body.cookie && newCookie) setCredentials({ cookie: newCookie });

  return [response, body];
}

export async function refreshCookie({
  credentials,
  setCredentials,
}: CredentialContext): Promise<CookieAuthResult | undefined> {
  const storedFile = localStorage.getItem(RIOT_COOKIE);
  if (!storedFile) return;

  const json = JSON.parse(storedFile) as StoredRiotCookie;
  if (json.expire > Date.now()) return json;

  credentials = setCredentials({
    cookie: extractCookieById(json.cookie, "asid") ?? "",
  });

  const [tokenRes, { cookie, ...accessTokens }] = await fetchWithCookie(
    { credentials, setCredentials },
    "/api/cookie",
    "asid",
    { method: "POST", headers: { Cookie: credentials.cookie } }
  );

  // console.log(credentials.cookie);
  // console.log(accessTokens);

  if (!accessTokens.response?.parameters?.uri) return;

  const { access_token, id_token, expires_in } = getTokensFromUri(
    accessTokens.response.parameters.uri
  );

  if (!access_token || !id_token || !expires_in || !cookie) {
    console.error("Invalid tokens returned by cookies API");
    return;
  }

  const refreshedTokens: StoredRiotCookie = {
    expire: Date.now() + expires_in * 1000,
    RSOtoken: access_token,
    idToken: id_token,
    cookie,
  };

  credentials = setCredentials(refreshedTokens);
  localStorage.setItem(RIOT_COOKIE, JSON.stringify(credentials));

  return refreshedTokens;
}

export function storeTokenWithUri(
  { credentials, setCredentials }: CredentialContext,
  uri: string
) {
  const { access_token, id_token, expires_in } = getTokensFromUri(uri);

  if (!access_token || !id_token || !expires_in) {
    throw Error("Unable to retrieve tokens from uri:" + uri);
  }

  credentials = setCredentials({
    RSOtoken: access_token,
    idToken: id_token,
    expire: Date.now() + expires_in * 1000,
  });

  // console.log("Storing", credentials);

  localStorage.setItem(RIOT_COOKIE, JSON.stringify(credentials));
}
