"use client";

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import styles from "./textField.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function TextField({
  title,
  textState,
}: {
  title: string;
  textState: [string, Dispatch<SetStateAction<string>>];
}) {
  const isPasswordField = title === "Password";
  const isUsernameField = title === "Username";

  const [text, setText] = textState;
  const [isFocused, setIsFocused] = useState(false);
  const [isVisible, setVisible] = useState(!isPasswordField);

  //Differentiate username, password and mfa fields
  const inputType = useMemo(() => {
    if (isPasswordField) return isVisible ? "text" : "password";
    if (isUsernameField) return "text";
    return "number";
  }, [isPasswordField, isUsernameField, isVisible]);

  return (
    <div className={styles.textFieldContainer}>
      <input
        className={styles.textField}
        type={inputType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setText(event.target.value);
        }}
        value={text}
        placeholder={inputType === "number" ? title : undefined}
      />
      {inputType !== "number" ? (
        <label
          className={`${styles.inputLabel} ${
            isFocused || text.length ? styles.inputLabelUp : ""
          }`}
        >
          {title}
        </label>
      ) : (
        <></>
      )}
      {isPasswordField && (isFocused || text.length) ? (
        <FontAwesomeIcon
          className={styles.hideIcon}
          icon={!isVisible ? faEye : faEyeSlash}
          onMouseDown={() => setVisible(true)}
          onMouseUp={() => setVisible(false)}
          onMouseLeave={() => setVisible(false)}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
