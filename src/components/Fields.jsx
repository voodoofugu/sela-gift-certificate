export function Field({ label, error, disabled, className = "", ...props }) {
  return (
    <label className={`field ${error ? "is-error" : ""} ${disabled ? "is-disabled" : ""} ${className}`}>
      <span>{label}</span>
      <span className="field__control">
        <input disabled={disabled} {...props} />
        {error && <b className="field__error-icon" aria-label="Поле заполнено неверно">!</b>}
      </span>
    </label>
  );
}

export function Checkbox({ checked, onChange, children }) {
  return (
    <label className="checkbox">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span aria-hidden="true" />
      {children}
    </label>
  );
}

export function PrimaryButton({ children, disabled, ...props }) {
  return (
    <button className="button button--primary" type="button" disabled={disabled} {...props}>
      {children}
    </button>
  );
}
