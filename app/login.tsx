"use client";

import { useState } from "react";


import Button from "./components/button";
import CheckBox from "./components/checkBox";
import TextField from "./components/textField";
import MfaDialog from "./components/mfaDialog";
import Error from "./components/error";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isKeepLoggedIn, setKeepLogin] = useState(false);

  const [otp, setOtp] = useState("");
  const [mfaError] = useState(false);
  const mfaDialog = MfaDialog({ otpState: [otp, setOtp]});

  const [error, setError] = useState(false);



  return (
    <>
    
        {mfaDialog.dialog}
        <Error show={error} message="Invalid username or password" />
        <TextField title="Username" textState={[username, setUsername]} />
        <TextField title="Password" textState={[password, setPassword]} />
        <CheckBox label="Stay signed in" state={[isKeepLoggedIn, setKeepLogin]} />
        <Button
          label="Sign In"
          onClick={() => {
            fetch("api/test", { method: "POST" });
            console.log("LOGIN");
            if (username === "asdf") {
              setError(false);
              mfaDialog.showDialog("test@abc.com");
              console.log(mfaError)
              
            } else setError(true);
          }}
        />
    </>
  );
}
