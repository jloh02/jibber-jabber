import { CookieAuthResult, StoredRiotCookie } from "./entities";

let CREDENTIALS: StoredRiotCookie = {
  cookie: "",
  RSOtoken: "",
  idToken: "",
  expire: 0,
};

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

export async function getNewCookie(): Promise<string> {
  for (let i = 0; i < 3; i++) {
    const [tokenRes, { cookie }] = await fetchWithCookie(
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
  url: URL | RequestInfo,
  cookieId: CookieId,
  init?: RequestInit
): Promise<[response: Response, body: any]> {
  let config = structuredClone(init);

  if (CREDENTIALS.cookie.length) {
    if (!config)
      config = { body: JSON.stringify({ cookie: CREDENTIALS.cookie }) };
    else if (!config.body)
      config.body = JSON.stringify({ cookie: CREDENTIALS.cookie });
    else
      config.body = JSON.stringify({
        cookie: CREDENTIALS.cookie,
        ...JSON.parse(config.body.toString()),
      });
  }

  const response = await fetch(url, config);
  const body = await response.json();

  const newCookie = extractCookieById(body.cookie, cookieId);
  if (body.cookie && newCookie) CREDENTIALS.cookie = newCookie;

  return [response, body];
}

export async function refreshCookie(): Promise<CookieAuthResult | undefined> {
  const storedFile = localStorage.getItem(RIOT_COOKIE);
  if (!storedFile) return;

  const json = JSON.parse(storedFile) as StoredRiotCookie;
  if (json.expire > Date.now()) return json;

  CREDENTIALS.cookie = extractCookieById(json.cookie, "asid") ?? "";

  const [tokenRes, { cookie, ...accessTokens }] = await fetchWithCookie(
    "/api/cookie",
    "asid",
    { method: "POST", headers: { Cookie: CREDENTIALS.cookie } }
  );

  console.log(CREDENTIALS.cookie);
  console.log(accessTokens);

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

  CREDENTIALS = refreshedTokens;
  localStorage.setItem(RIOT_COOKIE, JSON.stringify(CREDENTIALS));

  return refreshedTokens;
}

export function storeTokenWithUri(uri: string) {
  const { access_token, id_token, expires_in } = getTokensFromUri(uri);

  if (!access_token || !id_token || !expires_in) {
    throw Error("Unable to retrieve tokens from uri:" + uri);
  }

  CREDENTIALS.RSOtoken = access_token;
  CREDENTIALS.idToken = id_token;

  localStorage.setItem(RIOT_COOKIE, JSON.stringify(CREDENTIALS));
}
