"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { CredentialsContext } from "../lib/credentialContext";
import { StoredRiotCookie } from "../lib/entities";
import { getUnsavedData, refreshCookie } from "../lib/riot_cookies";

export default function ChatPage() {
  const context = useContext(CredentialsContext);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      let credentials = context.credentials;
      if (!credentials.cookie.length) {
        const creds = await refreshCookie(context);
        if (!credentials) {
          router.replace("/");
          return;
        }
        credentials = creds as StoredRiotCookie;
      }
      getUnsavedData({ credentials, setCredentials: context.setCredentials });
    })();
  }, []);

  return <div>Chat Page</div>;
}
