import styles from "./button.module.css";

export default function Button({
  onClick,
  label,
}: {
  onClick: () => any;
  label: string;
}) {
  return (
    <button className={styles.button} onClick={onClick}>
      <p className={styles.buttonText}>{label}</p>
    </button>
  );
}
