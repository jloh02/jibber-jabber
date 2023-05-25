import { riotFetch, RIOT_AUTH_URL } from "../apiGlobals";
import { type NextRequest, NextResponse } from "next/server";
import { updateBuildVersions } from "../apiGlobals";

const COOKIE_REQUEST_BODY = {
  client_id: "play-valorant-web-prod",
  nonce: 1,
  redirect_uri: "https://playvalorant.com/opt_in",
  response_type: "token id_token",
  scope: "account openid",
};

export async function POST(request: NextRequest) {
  await updateBuildVersions();

  const authRes = await riotFetch(RIOT_AUTH_URL, {
    method: "POST",
    body: JSON.stringify(COOKIE_REQUEST_BODY),
  });

  return NextResponse.json(await authRes.json(), {
    status: authRes.status,
    headers: authRes.headers,
  });
}
