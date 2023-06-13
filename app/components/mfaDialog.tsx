"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import TextField from "./textField";
import styles from "./mfaDialog.module.css";
import Error from "./error";


export default function MfaDialog({
  
  otpState,
  
}: {
  otpState: [string, Dispatch<SetStateAction<string>>];
}) {
  const mfaDialog = useRef<HTMLDialogElement>(null);
  const [otp, setOtp] = otpState;
  const [email, setEmail] = useState("");
  const [mfaError, setMfaError] = useState(false);


  useEffect(() => {
    if (mfaDialog.current)
      mfaDialog.current.onclose = () => {
        setOtp("");
        setMfaError(false);
      };
  }, [mfaDialog]);
  
  useEffect(() => {
    if (otp.length >= 6) {
      console.log("SUBMIT OTP");
      setOtp("");
      if (otp === "123456") {
        setMfaError(false);
        window.location.href = "/chat"
        mfaDialog.current?.close();
      } else {
        setMfaError(true);
      }
    }
  }, [otp]);
  return {

    dialog: (
      <dialog className={styles.dialog} ref={mfaDialog}>
        <div className={styles.dialogContainer}>
          <h1>2FA Authentication</h1>
          <p>A 6 digit code has been sent to {email}</p>
          <TextField title="Enter Code" textState={[otp, setOtp]} />
          <Error show={mfaError} message="Invalid Code" />
        </div>
      </dialog>
    ),
    showDialog: (email: string) => {
      setEmail(email);
      mfaDialog.current?.showModal();
    },

  };
}
