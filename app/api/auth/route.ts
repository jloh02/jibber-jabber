import { riotFetch, RIOT_AUTH_URL, sendResponse } from "../apiGlobals";
import { updateBuildVersions } from "../apiGlobals";
import { NextRequest } from "next/server";

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

  const body = (await authRes.json()) as RiotAuthResponse;

  return sendResponse(body, authRes);
}
