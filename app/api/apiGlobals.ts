import { Agent } from "https";
import fetch, { RequestInfo, RequestInit, Response } from "node-fetch";

const VERSION = {
  buildNumber: "",
  riotClientVersion: "",
};

export const RIOT_AUTH_URL = "https://auth.riotgames.com/api/v1/authorization";

// Getters for version variables
export function getBuildNumber() {
  return VERSION.buildNumber;
}
export function getRiotClientVersion() {
  return VERSION.riotClientVersion;
}

const CIPHERS = [
  "TLS_CHACHA20_POLY1305_SHA256",
  "TLS_AES_128_GCM_SHA256",
  "TLS_AES_256_GCM_SHA384",
  "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256",
];
const CUSTOM_AGENT = new Agent({
  ciphers: CIPHERS.join(":"),
  honorCipherOrder: true,
  minVersion: "TLSv1.2",
});

const headers = {
  "Content-Type": "application/json",
  "User-Agent": `RiotClient/${VERSION.buildNumber} rso-auth (Windows; 10;;Professional, x64)`,
};

export function riotFetch(
  url: URL | RequestInfo,
  init?: RequestInit
): Promise<Response> {
  return fetch(url, {
    agent: CUSTOM_AGENT,
    headers,
    ...init,
  });
}

let lastUpdateBuildVersion = 0;
export async function updateBuildVersions() {
  //5 minutes
  if (Date.now() - lastUpdateBuildVersion > 300000) return;
  lastUpdateBuildVersion = Date.now();
  try {
    const verRes = (await (
      await fetch("https://valorant-api.com/v1/version")
    ).json()) as any;

    VERSION.buildNumber = verRes.data.riotClientBuild;
    VERSION.riotClientVersion = verRes.data.version;
    if (!VERSION.buildNumber || !VERSION.riotClientVersion) {
      console.error("Undefined buildNumber and riotClientVersion: " + VERSION);
    }
  } catch (err) {
    console.error("Unable to get client build version: ", err);
  }
}
