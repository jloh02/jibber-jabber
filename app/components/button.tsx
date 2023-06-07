import styles from "./button.module.css";

export default function Button({
  onClick,
  label,
  disabled,
}: {
  onClick: () => any;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button className={styles.button} onClick={onClick} disabled={disabled}>
      <p className={styles.buttonText}>{label}</p>
    </button>
  );
}
