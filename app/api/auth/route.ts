import { riotFetch, RIOT_AUTH_URL } from "../apiGlobals";
import { updateBuildVersions } from "../apiGlobals";
import { NextRequest, NextResponse } from "next/server";

interface RiotAuthResponse {
  type: string;
  error?: string;
  multifactor?: any;
  country: string;
  securityProfile?: string;
  cookie?: string;
}

export async function PUT(request: NextRequest) {
  await updateBuildVersions();

  const { username, password, cookie } = await request.json();

  const authRes = await riotFetch(RIOT_AUTH_URL, {
    method: "PUT",
    body: JSON.stringify({
      type: "auth",
      username: username,
      password: password,
      remember: true,
      language: "en_US",
    }),
    headers: cookie ? { cookie } : undefined,
  });

  authRes.headers.delete("Content-Length");
  authRes.headers.delete("Content-Type");

  const body = (await authRes.json()) as RiotAuthResponse;

  body.cookie = authRes.headers
    .get("set-cookie")
    ?.split(", ")
    .find((v) => RegExp(`^asid`).test(v));

  return NextResponse.json(body, {
    status: authRes.status,
    headers: authRes.headers,
  });
}
