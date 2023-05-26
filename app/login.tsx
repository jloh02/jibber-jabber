"use client";

import { useState } from "react";
import Button from "./components/button";
import CheckBox from "./components/checkBox";
import TextField from "./components/textField";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isKeepLoggedIn, setKeepLogin] = useState(false);

  const [error, setError] = useState("");

  return (
    <>
      <TextField title="Username" textState={[username, setUsername]} />
      <TextField title="Password" textState={[password, setPassword]} />
      <div>
        <p>{error}</p>
      </div>
      <CheckBox label="Stay signed in" state={[isKeepLoggedIn, setKeepLogin]} />
      <Button
        label="Sign In"
        onClick={() => {
          fetch("api/test", { method: "POST" });
          console.log("CLICK");
        }}
      />
    </>
  );
}
