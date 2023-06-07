"use client";

import { useEffect, useState } from "react";
import Button from "./components/button";
import CheckBox from "./components/checkBox";
import TextField from "./components/textField";
import MfaDialog from "./components/mfaDialog";
import Error from "./components/error";
import { getNewCookie, refreshCookie } from "./lib/riot_cookies";
import Router from "next/router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isKeepLoggedIn, setKeepLogin] = useState(false);

  const [otp, setOtp] = useState("");
  const mfaDialog = MfaDialog({ otpState: [otp, setOtp] });

  const [error, setError] = useState("");

  useEffect(() => {
    refreshCookie().then(async (credentials) => {
      if (credentials) Router.replace("/chat");
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
          const cookie = await getNewCookie();

          const authRes = await fetch("/api/auth", {
            method: "PUT",
            body: JSON.stringify({ username, password, cookie }),
          });
          // setCookie((await authRes.json()).cookie);
          console.log(await authRes.json());

          // console.log("LOGIN");
          // if (username === "asdf") {
          //   setError(false);
          //   mfaDialog.showDialog("test@abc.com");
          // } else setError(true);
        }}
      />
    </>
  );
}
