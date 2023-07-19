import { getRiotClientVersion, riotFetch } from "../apiGlobals";
import { NextRequest, NextResponse } from "next/server";
import { updateBuildVersions } from "../apiGlobals";

export async function POST(request: NextRequest) {
  await updateBuildVersions();
  const { cookie, RSOtoken } = await request.json();
  try {
    if (!cookie || !RSOtoken)
      throw Error(
        `Invalid or missing parameters in request body: ${JSON.stringify({
          cookie,
          RSOtoken,
        })}`
      );

    const entRes = await riotFetch(
      "https://entitlements.auth.riotgames.com/api/token/v1",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RSOtoken}`,
          cookie,
        },
      }
    );

    const entResBody = await entRes.json();
    const entToken = (entResBody as any).entitlements_token;

    if (!entToken)
      throw Error(
        `entToken undefined. Entitlement endpoint returned: [${
          entRes.status
        }] ${JSON.stringify(entResBody)}`
      );

    // const pasGeoRes = await riotFetch(
    //   "https://riot-geo.pas.si.riotgames.com/pas/v1/product/valorant",
    //   {
    //     method: "POST",
    //     body: JSON.stringify({ id_token: credentials.idToken }),
    //     headers: {
    //       Authorization: `Bearer ${credentials.RSOtoken}`,
    //     },
    //   }
    // );
    // const pasGeoResBody = await pasGeoRes.json();
    // const PASregionToken = pasGeoResBody.token;
    // const region = pasGeoResBody.affinities.live;

    const PASres = await riotFetch(
      "https://riot-geo.pas.si.riotgames.com/pas/v1/service/chat",
      {
        headers: {
          Authorization: `Bearer ${RSOtoken}`,
          cookie,
        },
      }
    );
    const PAStoken = await PASres.text();
    const PASregion = JSON.parse(
      Buffer.from(PAStoken.split(".")[1], "base64").toString()
    ).affinity;

    if (!PASregion)
      throw Error(
        `PASregion undefined. Geo PAS endpoint returned: [${
          PASres.status
        }] ${JSON.stringify(PAStoken)}`
      );

    const xmppServerRes = await riotFetch(
      `https://clientconfig.rpg.riotgames.com/api/v1/config/player?os=windows&region=${PASregion}&app=Riot%20Client&version=${getRiotClientVersion()}&patchline=KeystoneFoundationLiveWin`,
      {
        headers: {
          "x-riot-entitlements-jwt": entToken,
          authorization: `Bearer ${RSOtoken}`,
          cookie,
        },
      }
    );
    const xmppServerResBody = (await xmppServerRes.json()) as any;

    const XMPPserver = xmppServerResBody["chat.affinities"][PASregion];
    const XMPPregion = xmppServerResBody["chat.affinity_domains"][PASregion];

    if (!XMPPserver || !XMPPregion)
      throw Error(
        `XMPP parameters undefined. Using region ${PASregion}, XMPP client config endpoint returned: [${
          xmppServerRes.status
        }] ${JSON.stringify(xmppServerResBody)}`
      );

    return NextResponse.json(
      { entToken, PASregion, XMPPserver, XMPPregion },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
