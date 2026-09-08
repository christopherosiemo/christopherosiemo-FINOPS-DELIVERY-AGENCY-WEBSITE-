import styles from "./text-field.module.css";

type TextFieldProps = {
  defaultValue?: string;
  disabled?: boolean;
  error?: string;
  hint?: string;
  id: string;
  label: string;
};

export function TextField({ defaultValue, disabled, error, hint, id, label }: TextFieldProps) {
  const descriptionId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        aria-describedby={descriptionId}
        aria-invalid={error ? true : undefined}
        className={styles.input}
        defaultValue={defaultValue}
        disabled={disabled}
        id={id}
        name={id}
        type="text"
      />
      {error ? (
        <p className={styles.error} id={descriptionId}>
          <span aria-hidden="true">!</span> {error}
        </p>
      ) : hint ? (
        <p className={styles.hint} id={descriptionId}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
