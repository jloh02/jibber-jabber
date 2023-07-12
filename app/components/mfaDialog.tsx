"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import TextField from "./textField";
import styles from "./mfaDialog.module.css";
import Error from "./error";
import { fetchWithCookie, storeTokenWithUri } from "../lib/riot_cookies";
import { useRouter } from "next/navigation";

export default function MfaDialog({
  otpState,
  keepLoggedIn,
}: {
  otpState: [string, Dispatch<SetStateAction<string>>];
  keepLoggedIn: boolean;
}) {
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

  useEffect(() => {
    if (otp.length >= 6) {
      setOtp("");
      fetchWithCookie("/api/mfa", "ssid", {
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
            if (keepLoggedIn) storeTokenWithUri(body.response.parameters.uri);
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
