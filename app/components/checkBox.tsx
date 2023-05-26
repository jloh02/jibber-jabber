import { Dispatch, SetStateAction } from "react";
import styles from "./checkBox.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";

export default function CheckBox({
  state,
  label,
}: {
  state: [boolean, Dispatch<SetStateAction<boolean>>];
  label: string;
}) {
  const [isChecked, setIsChecked] = state;
  return (
    <div className={styles.checkBoxContainer}>
      <div
        className={styles.checkBox + " " + (isChecked ? styles.checked : "")}
        onClick={() => setIsChecked((checked) => !checked)}
      >
        {isChecked && (
          <FontAwesomeIcon className={styles.checkmark} icon={faCheck} />
        )}
      </div>
      <p className={styles.label}>{label}</p>
    </div>
  );
}
