import { riotFetch, RIOT_AUTH_URL } from "../apiGlobals";
import { NextRequest, NextResponse } from "next/server";
import { updateBuildVersions } from "../apiGlobals";
import { RequestInit } from "node-fetch";

const COOKIE_REQUEST_BODY = {
  client_id: "play-valorant-web-prod",
  nonce: 1,
  redirect_uri: "https://playvalorant.com/opt_in",
  response_type: "token id_token",
  scope: "account openid",
};

interface RiotCookieResponse {
  type: string;
  country: string;
  error?: string;
  cookie?: string;
}

export async function POST(request: NextRequest) {
  await updateBuildVersions();

  const reqBody = await request.text();
  let cookie;
  try {
    cookie = JSON.parse(reqBody).cookie;
  } catch (e) {}

  const init: RequestInit = {
    method: "POST",
    body: JSON.stringify(COOKIE_REQUEST_BODY),
  };
  if (cookie) init.headers = { cookie };

  const authRes = await riotFetch(RIOT_AUTH_URL, init);
  const body = (await authRes.json()) as RiotCookieResponse;

  authRes.headers.delete("Content-Length");
  authRes.headers.delete("Content-Type");

  body.cookie = authRes.headers
    .get("set-cookie")
    ?.split(", ")
    .find((v) => RegExp(`^asid`).test(v));

  return NextResponse.json(body, {
    status: authRes.status,
    headers: authRes.headers,
  });
}
