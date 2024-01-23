import styles from "./input.module.css";

function Input({
  type,
  text,
  name,
  placeholder,
  handleOnChange,
  multiple,
  value,
}) {
  return (
    <div className={styles.form_control}>
      <label htmlFor={name}>{text}:</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={handleOnChange}
        value={value}
        {...(multiple ? { multiple } : "")}
      />
    </div>
  );
}

export default Input;
