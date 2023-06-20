"use client";

import { useEffect, useState } from "react";
import Button from "./components/button";
import CheckBox from "./components/checkBox";
import TextField from "./components/textField";
import MfaDialog from "./components/mfaDialog";
import Error from "./components/error";
import {
  fetchWithCookie,
  getNewCookie,
  refreshCookie,
} from "./lib/riot_cookies";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isKeepLoggedIn, setKeepLogin] = useState(false);

  const [otp, setOtp] = useState("");
  const mfaDialog = MfaDialog({ otpState: [otp, setOtp] });

  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    refreshCookie().then(async (credentials) => {
      if (credentials) router.replace("/chat");
    });
  }, []);

  return (
    <>
      {mfaDialog.dialog}
      <Error message={error} />
      <TextField title="Username" textState={[username, setUsername]} />
      <TextField title="Password" textState={[password, setPassword]} />
      <CheckBox label="Stay signed in" state={[isKeepLoggedIn, setKeepLogin]} />
      <Button
        label="Sign In"
        onClick={async () => {
          setError("");
          for (let i = 0; i < 3; i++) {
            const cookie = await getNewCookie();

            const [authRes, body] = await fetchWithCookie("/api/auth", "asid", {
              method: "PUT",
              body: JSON.stringify({ username, password, cookie }),
            });

            if (body.type === "error") continue;

            if (body.error === "rate_limited") {
              setError("Rate Limited. Try again later.");
              return;
            }

            if (body.error === "auth_failure") {
              setError("Incorrect username or password");
              return;
            }

            if (body.type === "multifactor") {
              mfaDialog.showDialog(body.multifactor.email);
              return;
            }

            setError("Unknown error occurred");
            return;
          }
          setError("An unexpected error occurred");
        }}
      />
    </>
  );
}
