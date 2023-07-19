"use client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import TextField from "./textField";
import styles from "./mfaDialog.module.css";
import Error from "./error";
import { fetchWithCookie, storeTokenWithUri } from "../lib/riot_cookies";
import { useRouter } from "next/navigation";
import { CredentialsContext } from "../lib/credentialContext";

export default function MfaDialog({
  otpState,
  keepLoggedIn,
}: {
  otpState: [string, Dispatch<SetStateAction<string>>];
  keepLoggedIn: boolean;
}) {
  const context = useContext(CredentialsContext);
  const mfaDialog = useRef<HTMLDialogElement>(null);
  const [otp, setOtp] = otpState;
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (mfaDialog.current)
      mfaDialog.current.onclose = () => {
        setOtp("");
        setError("");
      };
  }, [mfaDialog]);

  const fetchWithCookieCallback = useCallback(fetchWithCookie, [
    context.credentials,
  ]);
  const storeTokenWithUriCallback = useCallback(storeTokenWithUri, [
    context.credentials,
  ]);

  const [previousUri, setPreviousUri] = useState("");
  const [uri, setUri] = useState("");
  useEffect(() => {
    if (
      uri.length &&
      context.credentials &&
      keepLoggedIn &&
      uri != previousUri
    ) {
      storeTokenWithUriCallback(context, uri);
      setPreviousUri(uri);
    }
  }, [context.credentials, keepLoggedIn, uri, previousUri]);

  useEffect(() => {
    if (otp.length >= 6) {
      setOtp("");
      fetchWithCookieCallback(context, "/api/mfa", "ssid", {
        method: "PUT",
        body: JSON.stringify({ code: otp }),
      }).then(async ([res, body]) => {
        if (body.type === "error") {
          setError("Error");
          console.error("MFA auth failed with error:", body);
          return;
        }
        if (body.error === "multifactor_attempt_failed") {
          setError("Invalid Code");
          return;
        }
        if (body.type === "response") {
          if (!body.response?.parameters?.uri) {
            setError("Unable to retrieve token");
            console.error(body);
            return;
          } else {
            setError("");
            // console.log(keepLoggedIn, body.response.parameters);
            setUri(body.response.parameters.uri);
            router.push("/chat");
            return;
          }
        }
        setError("Unknown Error");
        console.error(body);
      });
    }
  }, [otp, keepLoggedIn]);

  return {
    dialog: (
      <dialog className={styles.dialog} ref={mfaDialog}>
        <div className={styles.dialogContainer}>
          <h1>2FA Authentication</h1>
          <p>
            A 6 digit code has been sent to
            <br />
            {email}
          </p>
          <TextField title="Enter Code" textState={[otp, setOtp]} />
          <Error message={error} />
        </div>
      </dialog>
    ),
    showDialog: (email: string) => {
      setEmail(email);
      mfaDialog.current?.showModal();
    },
  };
}
