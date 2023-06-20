import { riotFetch, RIOT_AUTH_URL, sendResponse } from "../apiGlobals";
import { NextRequest } from "next/server";
import { updateBuildVersions } from "../apiGlobals";

export async function PUT(request: NextRequest) {
  await updateBuildVersions();

  const { code, cookie } = await request.json();

  const authRes = await riotFetch(RIOT_AUTH_URL, {
    method: "PUT",
    body: JSON.stringify({
      type: "multifactor",
      code,
      rememberDevice: true,
    }),
    headers: {
      Cookie: cookie,
    },
  });

  const body = await authRes.json();

  return sendResponse(body, authRes);
}
