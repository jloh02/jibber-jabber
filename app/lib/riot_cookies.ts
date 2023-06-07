import { CookieAuthResult, StoredRiotCookie } from "./entities";

const RIOT_COOKIE = "RIOT_COOKIE";

function getTokensFromUri(uri: string) {
  const url = new URL(uri);
  const params = new URLSearchParams(url.hash.substring(1));
  const access_token = params.get("access_token");
  const id_token = params.get("id_token");
  const expires_in = parseInt(params.get("expires_in") || "0");

  return { access_token, id_token, expires_in };
}

export async function getNewCookie(): Promise<string> {
  for (let i = 0; i < 3; i++) {
    const tokenRes = await fetch("/api/cookie", { method: "POST" });
    const { cookie } = await tokenRes.json();
    if (cookie) return cookie;
  }
  throw Error("Unable to initialize cookies");
}

export async function refreshCookie(): Promise<CookieAuthResult | undefined> {
  const storedFile = localStorage.getItem(RIOT_COOKIE);
  if (!storedFile) return;

  const json = JSON.parse(storedFile) as StoredRiotCookie;
  if (json.expire > Date.now()) return json;

  const tokenRes = await fetch("/api/cookie", {
    method: "POST",
    headers: {
      Cookie: json.cookie,
    },
  });

  const { cookie, ...accessTokens } = await tokenRes.json();
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

  localStorage.setItem(RIOT_COOKIE, JSON.stringify(refreshedTokens));
  return refreshedTokens;
}
