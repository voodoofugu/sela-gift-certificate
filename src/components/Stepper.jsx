const steps = ["Дизайн", "Открытка", "Отправка", "Оплата"];

export function Stepper({ activeStep, maxStep, onStepChange }) {
  return (
    <ol className="stepper" aria-label="Этапы оформления">
      {steps.map((label, index) => {
        const step = index + 1;
        const enabled = step <= maxStep;
        const complete = step < activeStep;
        const active = step === activeStep;

        return (
          <li key={label}>
            <button
              className={`stepper__item ${active || complete ? "is-filled" : ""}`}
              type="button"
              disabled={!enabled}
              aria-current={active ? "step" : undefined}
              onClick={() => enabled && onStepChange(step)}
            >
              <span>{step}. {label}</span>
              <i aria-hidden="true" />
            </button>
          </li>
        );
      })}
    </ol>
  );
}
