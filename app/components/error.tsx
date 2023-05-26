import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import styles from "./error.module.css";

export default function Error({
  show,
  message,
}: {
  show: boolean;
  message: string;
}) {
  if (!show) return <></>;
  return (
    <div className={styles.error}>
      <FontAwesomeIcon icon={faTriangleExclamation} />
      <p className={styles.message}>{message}</p>
    </div>
  );
}
