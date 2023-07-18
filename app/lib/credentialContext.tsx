"use client";

import { createContext, useCallback, useState } from "react";
import { StoredRiotCookie } from "./entities";

const defaultCredentials: StoredRiotCookie = {
  cookie: "",
  RSOtoken: "",
  idToken: "",
  expire: 0,
};

export type CredentialContext = {
  credentials: StoredRiotCookie;
  setCredentials: (entries: Partial<StoredRiotCookie>) => StoredRiotCookie;
};

export const CredentialsContext = createContext<CredentialContext>({
  credentials: defaultCredentials,
  setCredentials: (entries: Partial<StoredRiotCookie>) => defaultCredentials,
});

export default function CredentialContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [credentials, setCredentialsState] =
    useState<StoredRiotCookie>(defaultCredentials);

  const setCredentials = useCallback(
    (entries: Partial<StoredRiotCookie>) => {
      const updatedCreds = { ...credentials, ...entries };
      setCredentialsState(updatedCreds);
      return updatedCreds;
    },
    [credentials]
  );

  return (
    <CredentialsContext.Provider value={{ credentials, setCredentials }}>
      {children}
    </CredentialsContext.Provider>
  );
}
